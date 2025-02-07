"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { ERC20_ABI } from "@/constants";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseSepolia, base } from "viem/chains";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";

if (!process.env.NEXT_PUBLIC_WALLET_ADDRESS) {
  throw new Error("NEXT_PUBLIC_WALLET_ADDRESS is required");
}
const serverWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS as `0x${string}`;

if (!process.env.NEXT_PUBLIC_USDC_ADDRESS) {
  throw new Error("NEXT_PUBLIC_USDC_ADDRESS is required");
}
const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

const chain =
  process.env.NEXT_PUBLIC_CHAIN_ENV === "testnet" ? base : baseSepolia;

export const PublisherView = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [spendAmount, setSpendAmount] = useState("");

  const usdcSpendAmount = useMemo(
    () => parseUnits(spendAmount, 6),
    [spendAmount]
  );

  const { address } = useAccount();
  const { signMessage, authenticated } = usePrivy();
  const { writeContract, data } = useWriteContract();
  const approvalTransaction = useWaitForTransactionReceipt({
    hash: data,
  });

  const ethBalance = useBalance({ address });
  const usdcBalance = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
  });

  const usdcAllowance = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address!, serverWallet],
  });

  useEffect(() => {
    if (approvalTransaction?.status === "success") {
      console.log("usdcAllowance refetch");
      usdcAllowance.refetch();
    }
  }, [approvalTransaction?.status, usdcAllowance]);

  const hasApproval = useMemo(() => {
    if (!usdcAllowance.data) return false;
    return usdcAllowance.data >= usdcSpendAmount;
  }, [usdcAllowance, usdcSpendAmount]);

  const router = useRouter();

  const approveSpend = async () => {
    console.log("approveBalance");
    writeContract({
      abi: ERC20_ABI,
      address: usdcAddress,
      functionName: "approve",
      args: [serverWallet, usdcSpendAmount],
      chain,
    });
  };

  const createCampaign = async () => {
    // Make request to server
    const timestamp = Math.floor(Date.now() / 1000);
    const message = JSON.stringify({
      name: campaignName,
      description: campaignDescription,
      amount: spendAmount,
      timestamp,
    });
    const uiOptions = {
      title: "Confirm",
      description: `Create Campaign?`,
      buttonText: `OK`,
    };
    const { signature } = await signMessage({ message }, { uiOptions });

    const { hash } = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        signature,
        address,
      }),
    }).then((res) => res.json());
    router.push(`/transactions/${hash}`);
  };

  if (!authenticated) {
    return (
      <div className="text-white flex justify-center p-8">
        Please login to continue.
      </div>
    );
  }

  return (
    <div className="text-white flex justify-center p-8">
      <div className={"flex flex-col gap-2"}>
        {hasApproval && (
          <div className="flex flex-col gap-2">
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
                placeholder={
                  "ETHGlobal is growing the most valuable developer community in web3"
                }
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
              />
            </div>
          </div>
        )}
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
          {hasApproval ? (
            <Button
              onClick={createCampaign}
              disabled={!campaignName || !campaignDescription || !spendAmount}
            >
              Create
            </Button>
          ) : (
            <Button onClick={approveSpend} disabled={!usdcSpendAmount}>
              Approve Spend
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
//
