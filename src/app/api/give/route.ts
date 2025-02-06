import { CAMPAIGN_UNIT_COST, MINUTE } from "@/constants";
import { getScript } from "@/utils/getScript";
import { grantRiceSeed } from "@/utils/grantRiceSeed";
import { reducePlantSupply } from "@/utils/reducePlantSupply";
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
  const { timestamp, plantType, agent, amount } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }
  const script = await getScript();

  const correctAmount = amount === script.amount;
  const correctAgent = agent === script.personInNeed;
  const correctPlant = plantType === script.foodType;

  // Take away plants from user
  const result = await reducePlantSupply({
    playerAddress: address,
    plantType,
    amount,
  });
  // If plants were taken away successfully
  if (result !== null) {
    if (correctAmount && correctAgent && correctPlant) {
      await grantRiceSeed({ playerAddress: address, cost: CAMPAIGN_UNIT_COST });
    }
  }

  return NextResponse.json({ success: true });
};
