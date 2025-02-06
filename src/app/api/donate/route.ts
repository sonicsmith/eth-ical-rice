import { CAMPAIGN_UNIT_COST, MINUTE } from "@/constants";
import { getPlantSupply } from "@/utils/getPlantSupply";
import { reducePlantSupply } from "@/utils/reducePlantSupply";
import { transferUsdcToCharity } from "@/utils/transferUsdcToCharity";
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
  const { timestamp } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }

  const plantSupply = await getPlantSupply(address);
  if (!plantSupply) {
    return NextResponse.json(
      { error: "Failed to get rice supply" },
      { status: 500 }
    );
  }
  const amount = plantSupply[2];
  const result = await reducePlantSupply({
    playerAddress: address,
    plantType: "rice",
    amount,
  });

  if (result === null) {
    return NextResponse.json(
      { error: "Can not reduce rice supply" },
      { status: 500 }
    );
  }

  const hash = await transferUsdcToCharity(BigInt(CAMPAIGN_UNIT_COST));

  return NextResponse.json({ hash });
};
