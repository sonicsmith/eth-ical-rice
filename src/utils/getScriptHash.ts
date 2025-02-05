"server only";

import { CONTRACT_ABI } from "@/constants";
import { getXaiPublicClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const getScriptHash = () => {
  const publicClient = getXaiPublicClient();
  return publicClient.readContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "getScriptHash",
  });
};
