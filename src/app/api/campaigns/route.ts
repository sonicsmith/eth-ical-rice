import { addCampaign } from "@/utils/addCampaign";
import { getVerifiedRequest } from "@/utils/getVerifiedRequest";
import { transferUsdcToServer } from "@/utils/transferUsdcToServer";
import { NextRequest, NextResponse } from "next/server";
import { parseUnits } from "viem";
import { getIsFlagged } from "./getIsFlagged";

export const POST = async (request: NextRequest) => {
  const verifiedRequest = await getVerifiedRequest(request);

  if (verifiedRequest.error) {
    return NextResponse.json({ error: verifiedRequest.error }, { status: 400 });
  }

  const { address, message } = verifiedRequest;
  const { name, description, amount } = JSON.parse(message);

  const isFlagged = await getIsFlagged(`${name} ${description}`);
  if (isFlagged) {
    return NextResponse.json(
      { error: "Message has been flagged by moderator" },
      { status: 400 }
    );
  }

  const usdcAmount = parseUnits(amount, 6);

  await transferUsdcToServer({ sender: address, amount: usdcAmount });

  const hash = await addCampaign({ name, description, amount: usdcAmount });

  return NextResponse.json({ hash });
};
