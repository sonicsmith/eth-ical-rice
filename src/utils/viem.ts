import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xaiTestnet } from "viem/chains";

if (!process.env.XAI_RPC_URL) {
  throw new Error("XAI_RPC_URL is required");
}
const rpc = process.env.XAI_RPC_URL;

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is required");
}
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

export const account = privateKeyToAccount(privateKey);

export const publicClient = createPublicClient({
  chain: xaiTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: xaiTestnet,
  transport: http(rpc),
  account,
});
