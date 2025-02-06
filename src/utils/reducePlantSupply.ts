"server only";

import { CONTRACT_ABI, PLANT_TYPES } from "@/constants";
import { getAccount, getXaiPublicClient, getXaiWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const reducePlantSupply = async ({
  playerAddress,
  plantType,
  amount,
}: {
  playerAddress: string;
  plantType: string;
  amount: number;
}) => {
  try {
    const publicClient = getXaiPublicClient();
    const account = getAccount();
    const nonce = await publicClient.getTransactionCount({
      address: account.address,
    });
    const plantTypeIndex = PLANT_TYPES.indexOf(plantType);
    const { request: simulatedRequest, result } =
      await publicClient.simulateContract({
        address,
        abi: CONTRACT_ABI,
        functionName: "reducePlantSupply",
        args: [playerAddress as `0x${string}`, plantTypeIndex, amount],
        account,
        nonce,
      });
    const walletClient = getXaiWalletClient();
    return walletClient.writeContract(simulatedRequest);
  } catch (error) {
    return null;
  }
};
