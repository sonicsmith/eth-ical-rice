"server only";

import { CONTRACT_ABI } from "@/constants";
import { getAccount, getXaiPublicClient, getXaiWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const harvestFarmPlot = async ({
  userAddress,
  index,
}: {
  userAddress: string;
  index: number;
}) => {
  const publicClient = getXaiPublicClient();
  const account = getAccount();
  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "harvestFarmPlot",
    args: [userAddress as `0x${string}`, index],
    account,
  });
  const walletClient = getXaiWalletClient();
  return walletClient.writeContract(simulatedRequest);
};
