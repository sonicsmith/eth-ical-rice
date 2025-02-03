import { CONTRACT_ABI } from "@/constants";
import { account, publicClient, walletClient } from "@/utils/viem";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.DEPLOYER_ADDRESS) {
  throw new Error("DEPLOYER_ADDRESS is required");
}

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is required");
}
const address = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const POST = async (request: NextRequest) => {
  const { name, description, amount } = await request.json();

  // TODO: name and description should be checked by AI content moderation

  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "addCampaign",
    args: [name, description, amount],
    account,
  });

  const hash = await walletClient.writeContract(simulatedRequest);

  return NextResponse.json({ hash });
};
