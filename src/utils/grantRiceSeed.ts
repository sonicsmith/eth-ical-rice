"server only";

import { CONTRACT_ABI } from "@/constants";
import { getAccount, getXaiPublicClient, getXaiWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const grantRiceSeed = async ({
  playerAddress,
  cost,
}: {
  playerAddress: string;
  cost: number;
}) => {
  try {
    const publicClient = getXaiPublicClient();
    const account = getAccount();
    const nonce = await publicClient.getTransactionCount({
      address: account.address,
    });
    const { request: simulatedRequest } = await publicClient.simulateContract({
      address,
      abi: CONTRACT_ABI,
      functionName: "grantRiceSeed",
      args: [playerAddress as `0x${string}`, BigInt(cost)],
      account,
      nonce,
    });
    const walletClient = getXaiWalletClient();
    return walletClient.writeContract(simulatedRequest);
  } catch (error) {
    return null;
  }
};
