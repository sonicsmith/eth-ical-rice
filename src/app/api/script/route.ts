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
    "bafkreieufx2fdhl4iuxxbjl45whpgzh7fmwdedz2whmapwoqjerhfjxhfy";

  const script = await fetch(
    `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_KEY}`
  ).then((res) => res.json());

  return NextResponse.json(script);
};
