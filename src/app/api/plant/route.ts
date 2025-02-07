import { PLANT_TYPES } from "@/constants";
import { getVerifiedRequest } from "@/utils/getVerifiedRequest";
import { plantAtFarmPlot } from "@/utils/plantAtFarmPlot";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const verifiedRequest = await getVerifiedRequest(request);

  if (verifiedRequest.error) {
    return NextResponse.json({ error: verifiedRequest.error }, { status: 400 });
  }

  const { address, message } = verifiedRequest;
  const { plantType, plotIndex } = JSON.parse(message);

  const plantNumber = PLANT_TYPES.indexOf(plantType);
  const hash = await plantAtFarmPlot({
    userAddress: address,
    plantType: plantNumber,
    index: plotIndex,
  });

  return NextResponse.json({ hash });
};
