import { getScriptHash } from "@/utils/getScriptHash";
import { NextResponse } from "next/server";

if (!process.env.PINATA_GATEWAY_URL) {
  throw new Error("NEXT_PUBLIC_GATEWAY_URL is not defined");
}
if (!process.env.PINATA_GATEWAY_KEY) {
  throw new Error("PINATA_GATEWAY_KEY is not defined");
}

export const GET = async () => {
  // TODO: Get the hash from a contract
  const ipfsHash = getScriptHash();

  const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;
  const queryString = `pinataGatewayToken=${process.env.PINATA_GATEWAY_KEY}`;
  const script = await fetch(`${url}?${queryString}`).then((res) => res.json());

  return NextResponse.json(script);
};
