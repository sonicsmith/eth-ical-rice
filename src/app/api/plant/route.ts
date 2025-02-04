import { MINUTE, PLANT_TYPES } from "@/constants";
import { plantAtFarmPlot } from "@/utils/plantAtFarmPlot";
import { getBasePublicClient } from "@/utils/viem";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { address, signature, message } = await request.json();

  if (!address || !signature || !message) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
  const publicClient = getBasePublicClient();
  const valid = await publicClient.verifyMessage({
    address,
    message,
    signature,
  });

  const { plantType, timestamp, plotIndex } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }

  const plantNumber = PLANT_TYPES.indexOf(plantType);
  await plantAtFarmPlot({
    userAddress: address,
    plantType: plantNumber,
    index: plotIndex,
  });

  return NextResponse.json({ valid });
};
