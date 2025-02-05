"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseSepolia, xaiTestnet, base, xai } from "viem/chains";
import { http } from "wagmi";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error("NEXT_PUBLIC_PRIVY_APP_ID is required");
}
const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const queryClient = new QueryClient();

const isTestnet = process.env.NEXT_PUBLIC_CHAIN_ENV === "testnet";

export const config = isTestnet
  ? createConfig({
      chains: [baseSepolia, xaiTestnet], // Pass your required chains as an array
      transports: {
        [baseSepolia.id]: http(),
        [xaiTestnet.id]: http(),
      },
    })
  : createConfig({
      chains: [base, xai], // Pass your required chains as an array
      transports: {
        [base.id]: http(),
        [xai.id]: http(),
      },
    });

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          //   logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        defaultChain: baseSepolia,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
