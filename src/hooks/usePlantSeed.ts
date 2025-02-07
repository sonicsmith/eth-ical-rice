import { FarmPlot } from "@/game/objects/FarmPlot";
import { PlantType } from "@/types";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useToast } from "./use-toast";
import { PLANT_TYPES } from "@/constants";

export const usePlantSeed = () => {
  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const plantSeed = useCallback(
    async (farmPlot: FarmPlot, plantType: PlantType) => {
      const timestamp = Math.floor(Date.now() / 1000);
      const message = JSON.stringify({
        plantType,
        timestamp,
        plotIndex: farmPlot.index,
      });
      const uiOptions = {
        title: "Confirm",
        description: `Plant ${plantType} seed?`,
        buttonText: `OK`,
      };
      let signResponse;
      try {
        signResponse = await signMessage({ message }, { uiOptions });
        const plantTypeIndex = PLANT_TYPES.indexOf(plantType);
        const plantTime = Math.floor(Date.now() / 1000);
        farmPlot.setPlant(plantTime, plantTypeIndex);
      } catch (error) {
        console.error(error);
        return null;
      }
      const { signature } = signResponse;
      const response = await fetch("/api/plant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      }).then((res) => res.json());
      toast({
        title: "Success",
        description: `Your ${plantType} has been planted`,
      });
      return response.hash;
    },
    [address, signMessage, toast]
  );

  return plantSeed;
};
