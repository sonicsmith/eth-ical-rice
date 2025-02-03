import { addCampaign } from "@/utils/addCampaign";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { name, description, amount } = await request.json();

  // TODO: name and description should be checked by AI content moderation

  const hash = await addCampaign({ name, description, amount });

  return NextResponse.json({ hash });
};
