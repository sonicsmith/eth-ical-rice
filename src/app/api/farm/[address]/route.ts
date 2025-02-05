import { NextResponse } from "next/server";
import { CONTRACT_ABI } from "@/constants";
import { getXaiPublicClient } from "@/utils/viem";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const GET = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  const playerAddress = params.address as `0x${string}`;
  const publicClient = getXaiPublicClient();
  const farmPlots = await publicClient.readContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "getFarmPlots",
    args: [playerAddress],
  });
  return NextResponse.json(
    farmPlots.map(({ time, plantType }) => ({
      time: Number(time),
      plantType,
    }))
  );
};
