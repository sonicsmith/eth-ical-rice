import { MINUTE } from "@/constants";
import { getVerifiedRequest } from "@/utils/getVerifiedRequest";
import { harvestFarmPlot } from "@/utils/harvestFarmPlot";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const verifiedRequest = await getVerifiedRequest(request);

  if (verifiedRequest.error) {
    return NextResponse.json({ error: verifiedRequest.error }, { status: 400 });
  }

  const { address, message } = verifiedRequest;

  const { timestamp, plotIndex } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }

  const hash = await harvestFarmPlot({
    userAddress: address,
    index: plotIndex,
  });

  return NextResponse.json({ hash });
};
