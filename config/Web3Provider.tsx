"use client";
import React from "react";
import { Config, http, createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";
import { metaMask } from "wagmi/connectors";
import { sepolia, liskSepolia } from "viem/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_REOWN_ID || '';
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_ID || '';

export const config = defaultConfig({
  appName: "eJourney",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [sepolia, liskSepolia],
  ssr: true
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          customLogoHeight={42}
          theme={darkTheme}>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};