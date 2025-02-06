import { FarmPlot } from "@/game/objects/FarmPlot";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useToast } from "./use-toast";
import { PLANT_TYPES } from "@/constants";
import { getCapitalized } from "@/utils/getCapitalized";

export const useHarvestPlant = () => {
  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const harvestPlant = useCallback(
    async (farmPlot: FarmPlot) => {
      const plantNumber = farmPlot.plantNumber!;
      const plantName = PLANT_TYPES[plantNumber];
      const message = JSON.stringify({
        timestamp: Math.floor(Date.now() / 1000),
        plotIndex: farmPlot.index,
      });
      const uiOptions = {
        title: "Confirm",
        description: `Harvest ${plantName}?`,
        buttonText: `OK`,
      };
      const { signature } = await signMessage({ message }, { uiOptions });
      const response = await fetch("/api/harvest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      }).then((res) => res.json());
      toast({
        title: getCapitalized(plantName),
        description: `You harvested your ${plantName}!`,
      });
      return response.hash;
    },
    [address, signMessage, toast]
  );

  return harvestPlant;
};
