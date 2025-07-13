"use client";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import useGetUserData from "@/hooks/useAddress";
import { ConnectingPage } from "@/components/dashboard/ConnectingPage";
import RegisterForm from "@/components/dashboard/RegisterForm";
import DisplayMap from "@/components/dashboard/DisplayMapPage";

export default function Page() {
    const { address, isConnected } = useAccount();
    const { users, loading: userDataLoading, error } = useGetUserData();
    const [isInitialized, setIsInitialized] = useState(false);
    const [finalComponent, setFinalComponent] = useState<React.ReactNode>(null);
    const [isWalletChecking, setIsWalletChecking] = useState(true);

    useEffect(() => {
        // Initial wallet connection check with timeout
        const walletCheckTimer = setTimeout(() => {
            setIsWalletChecking(false);
        }, 2000); // Give 2 seconds for wallet connection to be determined

        return () => clearTimeout(walletCheckTimer);
    }, []);

    useEffect(() => {
        console.log('State check:', { 
            address, 
            isConnected, 
            users, 
            userDataLoading, 
            error,
            isInitialized,
            isWalletChecking 
        });

        // Wait for initial wallet check to complete
        if (isWalletChecking) {
            console.log('Still checking wallet connection...');
            return;
        }

        // Wait for wallet connection state to be determined
        if (isConnected === undefined) {
            console.log('Waiting for wallet connection state...');
            return;
        }

        // Case 1: No wallet connected
        if (!isConnected || !address) {
            console.log('No wallet connected - showing ConnectingPage');
            setFinalComponent(<ConnectingPage />);
            setIsInitialized(true);
            return;
        }

        // Case 2: Wallet connected but still loading user data
        if (isConnected && address && userDataLoading) {
            console.log('Wallet connected, loading user data...');
            return; // Keep showing loading
        }

        // Case 3: Wallet connected, user data loaded, but user not registered
        if (isConnected && address && !userDataLoading && (!users || !users.id)) {
            console.log('Wallet connected, no user found - showing RegisterForm');
            setFinalComponent(<RegisterForm />);
            setIsInitialized(true);
            return;
        }

        // Case 4: Wallet connected, user registered
        if (isConnected && address && !userDataLoading && users && users.id) {
            console.log('Wallet connected, user found - showing DisplayMap');
            setFinalComponent(
                <main className="space-y-5">
                    <DisplayMap />
                </main>
            );
            setIsInitialized(true);
            return;
        }

        // Case 5: Error state
        if (error) {
            console.log('Error occurred:', error);
            setFinalComponent(<ConnectingPage />);
            setIsInitialized(true);
            return;
        }

    }, [address, isConnected, users, userDataLoading, error, isWalletChecking]);

    // Show loading when:
    // 1. Still checking wallet connection initially
    // 2. Haven't initialized the component yet
    // 3. Wallet is connected and we're loading user data
    if (isWalletChecking || !isInitialized || (isConnected && address && userDataLoading)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="relative">
                    {/* Animated circles */}
                    <div className="w-20 h-20 relative">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    
                    {/* Pulsing dots */}
                    <div className="flex space-x-2 mt-6 justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Preparing your journey...
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isWalletChecking ? 'Checking wallet connection...' : 
                         !isConnected ? 'Waiting for wallet...' : 
                         userDataLoading ? 'Loading your profile...' :
                         'Initializing app...'}
                    </p>
                </div>
            </div>
        );
    }

    return <>{finalComponent}</>;
}