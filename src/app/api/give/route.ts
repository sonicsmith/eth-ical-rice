import { CAMPAIGN_UNIT_COST } from "@/constants";
import { getScript } from "@/utils/getScript";
import { getVerifiedRequest } from "@/utils/getVerifiedRequest";
import { grantRiceSeed } from "@/utils/grantRiceSeed";
import { reducePlantSupply } from "@/utils/reducePlantSupply";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const verifiedRequest = await getVerifiedRequest(request);

  if (verifiedRequest.error) {
    return NextResponse.json({ error: verifiedRequest.error }, { status: 400 });
  }

  const { address, message } = verifiedRequest;
  const { plantType, agent, amount } = JSON.parse(message);

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
