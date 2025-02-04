"server only";

import { CONTRACT_ABI } from "@/constants";
import { account, publicClient, walletClient } from "@/utils/viem";

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is required");
}
const address = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const addCampaign = async ({
  name,
  description,
  amount,
}: {
  name: string;
  description: string;
  amount: bigint;
}) => {
  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "addCampaign",
    args: [name, description, amount],
    account,
  });

  return walletClient.writeContract(simulatedRequest);
};
