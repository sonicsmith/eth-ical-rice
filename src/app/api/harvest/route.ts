import { NextResponse } from "next/server";

export const GET = () => {
  // TODO: Harvest the farm plot in contract
  return NextResponse.json({ success: true });
};
