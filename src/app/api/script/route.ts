import { NextResponse } from "next/server";
import { generateScript } from "./generateScript";

export const GET = async () => {
  const script = await generateScript();

  console.log(script);

  return NextResponse.json(script);
};
