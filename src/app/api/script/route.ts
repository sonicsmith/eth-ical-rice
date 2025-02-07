import { getScript } from "@/utils/getScript";
import { NextResponse } from "next/server";

export const GET = async () => {
  const script = await getScript();
  return NextResponse.json(script);
};
