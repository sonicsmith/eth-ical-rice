import { NextResponse } from "next/server";
import { CONTRACT_ABI } from "@/constants";
import { publicClient } from "@/utils/viem";

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is required");
}
const address = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const GET = async (
  request: Request,
  { params }: { params: { address: string } }
) => {
  const playerAddress = params.address as `0x${string}`;
  const farmPlots = await publicClient.readContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "getFarmPlots",
    args: [playerAddress],
  });
  return NextResponse.json(
    farmPlots.map(({ time, plotType }) => ({
      time: Number(time),
      plotType,
    }))
  );
};
