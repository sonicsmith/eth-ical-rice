import { NextRequest } from "next/server";
import { getBasePublicClient } from "./viem";
import { MINUTE } from "@/constants";

export const getVerifiedRequest = async (request: NextRequest) => {
  const { address, signature, message } = await request.json();

  if (!address || !signature || !message) {
    return { error: "Invalid Request" };
  }
  const publicClient = getBasePublicClient();
  const valid = await publicClient.verifyMessage({
    address,
    message,
    signature,
  });

  if (!valid) {
    return { error: "Invalid Signature" };
  }

  const { timestamp } = JSON.parse(message);

  const timeSinceSignature = Date.now() / 1000 - timestamp;
  if (timeSinceSignature > MINUTE) {
    return { error: "Expired Signature" };
  }

  return { address, signature, message };
};
