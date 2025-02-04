import { MINUTE } from "@/constants";
import { addCampaign } from "@/utils/addCampaign";
import { transferUsdc } from "@/utils/transferUsdc";
import { getBasePublicClient } from "@/utils/viem";
import { NextRequest, NextResponse } from "next/server";
import { parseUnits } from "viem";

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

  const { name, description, amount, timestamp } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return NextResponse.json({ error: "Expired Signature" }, { status: 400 });
  }

  // TODO: name and description should be checked by AI content moderation

  const usdcAmount = parseUnits(amount, 6);

  await transferUsdc({ sender: address, amount: usdcAmount });

  const hash = await addCampaign({ name, description, amount: usdcAmount });

  return NextResponse.json({ hash });
};
