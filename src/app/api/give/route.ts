import { MINUTE, PLANT_TYPES } from "@/constants";
import { getScript } from "@/utils/getScript";
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
  if (!valid) {
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }
  const { timestamp, plant, agent, amount } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }

  const script = await getScript();

  const correctAmount = amount === script.amount;
  const correctAgent = agent === script.personInNeed;
  const correctPlant = plant === script.foodType;

  let success = false;

  if (correctAmount && correctAgent && correctPlant) {
    success = true;
    // Give user rice seed
  }

  return NextResponse.json({ success });
};
