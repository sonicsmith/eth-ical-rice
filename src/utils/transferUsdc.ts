"server only";

import { ERC20_ABI } from "@/constants";
import { account, publicClient, walletClient } from "@/utils/viem";

if (!process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DEPLOYER_ADDRESS is required");
}
const recipient = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS as `0x${string}`;

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is required");
}
const address = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const transferUsdc = async ({
  sender,
  amount,
}: {
  sender: string;
  amount: bigint;
}) => {
  const { request: simulatedRequest } = await publicClient.simulateContract({
    address,
    abi: ERC20_ABI,
    functionName: "transferFrom",
    args: [sender as `0x${string}`, recipient, amount],
    account,
  });

  return walletClient.writeContract(simulatedRequest);
};
