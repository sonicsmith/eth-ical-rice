import { NextResponse } from "next/server";

if (!process.env.PINATA_GATEWAY_URL) {
  throw new Error("NEXT_PUBLIC_GATEWAY_URL is not defined");
}
if (!process.env.PINATA_GATEWAY_KEY) {
  throw new Error("PINATA_GATEWAY_KEY is not defined");
}

export const GET = async () => {
  // TODO: Get the hash from a contract
  const ipfsHash =
    "bafkreifaelxfypcds74ck36qg7npmt5db4mddwccg5cbdec7uynowbbtji";

  const script = await fetch(
    `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_KEY}`
  ).then((res) => res.json());

  return NextResponse.json(script);
};
