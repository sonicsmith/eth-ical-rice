import { getScript } from "@/utils/getScript";
import { NextResponse } from "next/server";

export const GET = async () => {
  // TODO: Get the hash from a contract
  const script = await getScript();

  return NextResponse.json(script);
};
