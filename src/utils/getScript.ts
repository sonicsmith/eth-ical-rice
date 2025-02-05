"use server";

import { Script } from "@/types";
import { getScriptHash } from "./getScriptHash";

if (!process.env.PINATA_GATEWAY_URL) {
  throw new Error("NEXT_PUBLIC_GATEWAY_URL is not defined");
}
if (!process.env.PINATA_GATEWAY_KEY) {
  throw new Error("PINATA_GATEWAY_KEY is not defined");
}

export const getScript = async (): Promise<Script> => {
  const ipfsHash = await getScriptHash();
  const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;
  const queryString = `pinataGatewayToken=${process.env.PINATA_GATEWAY_KEY}`;
  return fetch(`${url}?${queryString}`).then((res) => res.json());
};
