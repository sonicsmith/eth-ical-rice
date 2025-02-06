import { PlantType } from "@/types";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useToast } from "./use-toast";

export const useGiveToAgent = () => {
  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const giveToAgent = useCallback(
    async ({
      amount,
      plantType,
      agent,
    }: {
      amount: number;
      plantType: PlantType;
      agent: string;
    }) => {
      const message = JSON.stringify({
        timestamp: Math.floor(Date.now() / 1000),
        plantType,
        amount,
        agent,
      });
      const { signature } = await signMessage({ message });
      const response = await fetch("/api/give", {
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
        title: "Success",
        description: `Your ${plantType} has been given to ${agent}`,
      });
      return response.hash;
    },
    [address, signMessage, toast]
  );

  return giveToAgent;
};
