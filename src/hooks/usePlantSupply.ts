import { CONTRACT_ABI } from "@/constants";
import { getChainIds } from "@/utils/getChainIds";
import { useReadContract } from "wagmi";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const chainId = getChainIds().xai;

export const usePlantSupply = (playerAddress: `0x${string}`) => {
  const response = useReadContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "getPlantSupply",
    chainId,
    args: [playerAddress],
  });

  return response;
};
