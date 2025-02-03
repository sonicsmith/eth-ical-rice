import { publicClient } from "@/utils/viem";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { address, signature, message } = await request.json();

  if (!address || !signature || !message) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const valid = await publicClient.verifyMessage({
    address,
    message,
    signature,
  });

  // TODO: If valid, set the farm plot in the contract

  return NextResponse.json({ valid });
};
