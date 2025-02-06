import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useToast } from "./use-toast";

export const useDonateRice = () => {
  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { toast } = useToast();

  const donateRice = useCallback(async () => {
    const message = JSON.stringify({
      timestamp: Math.floor(Date.now() / 1000),
    });
    const uiOptions = {
      title: "Confirm",
      description: `Donate all your rice to charity?`,
      buttonText: `OK`,
    };
    const { signature } = await signMessage({ message }, { uiOptions });
    const response = await fetch("/api/donate", {
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
      description: `Your rice has been donated to charity!`,
    });
    return response.hash;
  }, [address, signMessage, toast]);

  return donateRice;
};
