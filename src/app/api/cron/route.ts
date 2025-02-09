import { NextResponse, type NextRequest } from "next/server";
import { generateScript } from "./generateScript";
import { pinata } from "@/utils/pinata";
import { setScriptHash } from "@/utils/setScriptHash";

export const maxDuration = 300; // 5 minutes

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  console.log("Getting instructions");
  const script = await generateScript();

  console.log("uploading new instructions to ipfs");
  const date = new Date().toISOString().slice(0, 10);
  const uploadData = await pinata.upload.json(script, {
    metadata: {
      name: `eth-ical-rice-${date}.json`,
    },
  });

  await setScriptHash(uploadData.IpfsHash);

  return NextResponse.json({ hash: uploadData.IpfsHash }, { status: 200 });
};
