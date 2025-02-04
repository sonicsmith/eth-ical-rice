"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error("NEXT_PUBLIC_PRIVY_APP_ID is required");
}
const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const queryClient = new QueryClient();

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
          showWalletUIs: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PrivyProvider>
  );
};
