"server only";

import { CONTRACT_ABI } from "@/constants";
import { getAccount, getXaiPublicClient, getXaiWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const reducePlantSupply = async ({
  playerAddress,
  plant,
  amount,
}: {
  playerAddress: string;
  plant: string;
  amount: number;
}) => {
  try {
    const publicClient = getXaiPublicClient();
    const account = getAccount();
    const nonce = await publicClient.getTransactionCount({
      address: account.address,
    });
    const plantType = plant === "wheat" ? 0 : 1;
    const { request: simulatedRequest, result } =
      await publicClient.simulateContract({
        address,
        abi: CONTRACT_ABI,
        functionName: "reducePlantSupply",
        args: [playerAddress as `0x${string}`, plantType, amount],
        account,
        nonce,
      });
    const walletClient = getXaiWalletClient();
    return walletClient.writeContract(simulatedRequest);
  } catch (error) {
    return null;
  }
};
