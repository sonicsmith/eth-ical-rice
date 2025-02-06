import { FarmPlot } from "@/game/objects/FarmPlot";
import { PlantType } from "@/types";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useToast } from "./use-toast";

export const usePlantSeed = (selectedFarmPlot: FarmPlot | null) => {
  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const plantSeed = useCallback(
    async (plantType: PlantType) => {
      if (!selectedFarmPlot) {
        throw new Error("No farm plot selected");
      }
      const timestamp = Math.floor(Date.now() / 1000);
      const message = JSON.stringify({
        plantType,
        timestamp,
        plotIndex: selectedFarmPlot.index,
      });
      const uiOptions = {
        title: "Confirm",
        description: `Plant ${plantType} seed?`,
        buttonText: `OK`,
      };
      const { signature } = await signMessage({ message }, { uiOptions });
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
    [address, signMessage, toast, selectedFarmPlot]
  );

  return plantSeed;
};
