"server only";

import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xaiTestnet, baseSepolia, xai, base } from "viem/chains";

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === "testnet";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is required");
}
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

if (!process.env.QUICKNODE_RPC_NAME) {
  throw new Error("QUICKNODE_RPC_NAME is required");
}
const rpcName = process.env.QUICKNODE_RPC_NAME;

if (!process.env.QUICKNODE_API_KEY) {
  throw new Error("QUICKNODE_API_KEY is required");
}
const rpcApiKey = process.env.QUICKNODE_API_KEY;

export const getAccount = () => {
  return privateKeyToAccount(privateKey);
};

export const getXaiPublicClient = () => {
  const chainName = isTestnet ? "xai-testnet" : "xai";
  const rpc = `https://${rpcName}.${chainName}.quiknode.pro/${rpcApiKey}`;
  return createPublicClient({
    chain: isTestnet ? xaiTestnet : xai,
    transport: http(rpc),
  });
};

export const getXaiWalletClient = () => {
  const chainName = isTestnet ? "xai-testnet" : "xai";
  const rpc = `https://${rpcName}.${chainName}.quiknode.pro/${rpcApiKey}`;
  return createWalletClient({
    chain: isTestnet ? xaiTestnet : xai,
    transport: http(rpc),
    account: getAccount(),
  });
};

export const getBasePublicClient = () => {
  const chainName = isTestnet ? "base-sepolia" : "base";
  const rpc = `https://${rpcName}.${chainName}.quiknode.pro/${rpcApiKey}`;
  return createPublicClient({
    chain: isTestnet ? baseSepolia : base,
    transport: http(rpc),
  });
};

export const getBaseWalletClient = () => {
  const chainName = isTestnet ? "base-sepolia" : "base";
  const rpc = `https://${rpcName}.${chainName}.quiknode.pro/${rpcApiKey}`;
  return createWalletClient({
    chain: isTestnet ? baseSepolia : base,
    transport: http(rpc),
    account: getAccount(),
  });
};
