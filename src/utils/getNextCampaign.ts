"server only";

import { CONTRACT_ABI } from "@/constants";
import { getXaiPublicClient } from "./viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const getNextCampaign = async () => {
  try {
    const publicClient = getXaiPublicClient();
    return publicClient.readContract({
      address,
      abi: CONTRACT_ABI,
      functionName: "getNextCampaign",
    });
  } catch (e) {
    // If there are no campaigns available, return null
    console.error(e);
    return null;
  }
};
