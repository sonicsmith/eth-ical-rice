"server only";

import { ERC20_ABI } from "@/constants";
import { getAccount, getBasePublicClient, getBaseWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DEPLOYER_ADDRESS is required");
}
const recipient = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS as `0x${string}`;

if (!process.env.NEXT_PUBLIC_USDC_ADDRESS) {
  throw new Error("NEXT_PUBLIC_USDC_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export const transferUsdc = async ({
  sender,
  amount,
}: {
  sender: string;
  amount: bigint;
}) => {
  const publicClient = getBasePublicClient();
  const account = getAccount();
  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: ERC20_ABI,
    functionName: "transferFrom",
    args: [sender as `0x${string}`, recipient, amount],
    account,
  });
  const walletClient = getBaseWalletClient();
  return walletClient.writeContract(simulatedRequest);
};
