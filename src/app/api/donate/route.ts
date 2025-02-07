import { CAMPAIGN_UNIT_COST } from "@/constants";
import { getPlantSupply } from "@/utils/getPlantSupply";
import { getVerifiedRequest } from "@/utils/getVerifiedRequest";
import { reducePlantSupply } from "@/utils/reducePlantSupply";
import { transferUsdcToCharity } from "@/utils/transferUsdcToCharity";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const verifiedRequest = await getVerifiedRequest(request);

  if (verifiedRequest.error) {
    return NextResponse.json({ error: verifiedRequest.error }, { status: 400 });
  }

  const { address } = verifiedRequest;

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
