"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { ERC20_ABI } from "@/constants";
import { useAccount, useWriteContract } from "wagmi";

if (!process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DEPLOYER_ADDRESS is required");
}
const serverWallet = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS as `0x${string}`;
if (!process.env.NEXT_PUBLIC_USDC_ADDRESS) {
  throw new Error("NEXT_PUBLIC_USDC_ADDRESS is required");
}
const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export const PublisherView = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [spendAmount, setSpendAmount] = useState("");

  const { address } = useAccount();
  const { signMessage } = usePrivy();
  const { writeContract } = useWriteContract();

  const createCampaign = async () => {
    // Approve USDC to server wallet
    await writeContract({
      abi: ERC20_ABI,
      address: usdcAddress,
      functionName: "approve",
      args: [serverWallet, BigInt(spendAmount)],
    });

    // Make request to server
    const timestamp = Math.floor(Date.now() / 1000);
    const message = JSON.stringify({
      name: campaignName,
      description: campaignDescription,
      amount: spendAmount,
      timestamp,
    });
    const { signature } = await signMessage({ message });

    await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        signature,
        address,
      }),
    });
  };

  return (
    <div className="text-white flex justify-center p-8">
      <div className={"flex flex-col gap-2"}>
        <div className="text-2xl">Campaign Name:</div>
        <div>
          <Input
            placeholder={"ETHGlobal"}
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <div className="text-2xl">Campaign Description:</div>
        <div>
          <Input
            placeholder={"Building the most valuable community in web3."}
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
          />
        </div>
        <div className="text-2xl">Spend Amount ($USD):</div>
        <div>
          <Input
            type={"number"}
            placeholder={"10.00"}
            value={spendAmount}
            onChange={(e) => setSpendAmount(e.target.value)}
          />
        </div>
        <div className="mt-8">
          <Button onClick={createCampaign}>Create</Button>
        </div>
      </div>
    </div>
  );
};
//
