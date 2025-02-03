"server only";

import { CONTRACT_ABI } from "@/constants";
import { publicClient } from "./viem";

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is required");
}
const address = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const getNextCampaign = async () => {
  try {
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
