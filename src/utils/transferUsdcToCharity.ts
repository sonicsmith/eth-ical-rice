"server only";

import { ERC20_ABI } from "@/constants";
import { getAccount, getBasePublicClient, getBaseWalletClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CHARITY_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CHARITY_ADDRESS is required");
}
const charityAddress = process.env.NEXT_PUBLIC_CHARITY_ADDRESS as `0x${string}`;

if (!process.env.NEXT_PUBLIC_USDC_ADDRESS) {
  throw new Error("NEXT_PUBLIC_USDC_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export const transferUsdcToCharity = async (amount: bigint) => {
  const publicClient = getBasePublicClient();
  const account = getAccount();
  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [charityAddress, amount],
    account,
  });
  const walletClient = getBaseWalletClient();
  return walletClient.writeContract(simulatedRequest);
};
