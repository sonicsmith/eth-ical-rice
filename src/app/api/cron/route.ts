import { NextResponse, type NextRequest } from "next/server";
import { generateScript } from "./generateScript";
import { pinata } from "@/utils/pinata";

export const GET = async (request: NextRequest) => {
  console.log("Getting instructions");
  const script = await generateScript();

  console.log("uploading new instructions to ipfs");
  const date = new Date().toISOString().slice(0, 10);
  const uploadData = await pinata.upload.json(script, {
    metadata: {
      name: `eth-ical-rice-${date}.json`,
    },
  });
  const url = await pinata.gateways.convert(uploadData.IpfsHash);

  // TODO: Save the hash to a contract

  return NextResponse.json({ url }, { status: 200 });
};
