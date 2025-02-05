const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === "testnet";

export const getChainIds = () => {
  return {
    xai: isTestnet ? 37714555429 : 660279,
    base: isTestnet ? 84532 : 8453,
  };
};
