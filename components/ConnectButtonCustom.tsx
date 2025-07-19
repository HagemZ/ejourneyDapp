'use client'
import React, { useState, useEffect } from 'react'
import { ConnectButton } from "@xellar/kit";
import useResponsive from "@/hooks/useResponsive";
import { MapPin, User, LogOut, Navigation, Map, Loader2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from 'sonner';
import useGetUserData from "@/hooks/useAddress";
import { useReadContract, useAccount } from 'wagmi';
import { abiJTN, JTN_TOKEN_ADDRESS } from "@/utils/abiJTN";
import { formatEther } from 'viem';


const ConnectButtonCustom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { deviceWidth } = useResponsive();
  const { users } = useGetUserData();
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  
  const isDashboard = pathname === '/dashboard';

  // Read JTN token balance using wagmi
  const { 
    data: jtnBalance, 
    isLoading: isLoadingBalance, 
    refetch: refetchBalance,
    isError: isBalanceError 
  } = useReadContract({
    address: JTN_TOKEN_ADDRESS as `0x${string}`,
    abi: abiJTN,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected, // Only run when address is available and connected
      refetchOnWindowFocus: false,
      staleTime: 30000, // Consider data stale after 30 seconds
    },
  });

  // Format the balance for display
  const formattedBalance = jtnBalance 
    ? parseFloat(formatEther(jtnBalance)).toFixed(4)
    : '0.0000';

  // Simulate initial wallet check loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Manual refresh function
  const handleRefreshBalance = () => {
    if (address && isConnected) {
      refetchBalance();
      toast.success('Balance refreshed!');
    }
  };
  //   console.log(deviceWidth);

    return (
        <div>
            <ConnectButton.Custom>
                {({ openConnectModal, disconnect, isConnected, openChainModal, openProfileModal, account, chain }) => {
                    // Show loading state while checking connection
                    if (isLoading) {
                        return (
                            <Button
                                className="px-6 py-2 bg-gray-100 text-gray-500 font-medium rounded-xl cursor-not-allowed"
                                disabled
                            >
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Checking Wallet...
                            </Button>
                        );
                    }

                    return !isConnected ? (
                        <Button
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={openConnectModal}
                        >
                            Connect Wallet
                        </Button>
                      
                    ) : (
                        <div className="flex items-center space-x-3">
                            {/* JTN Balance Display */}
                            {deviceWidth >= 768 ? (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 font-medium rounded-lg">
                                    <Coins className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        {isLoadingBalance ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : isBalanceError ? (
                                            'Error'
                                        ) : (
                                            `${formattedBalance} JTN`
                                        )}
                                    </span>
                                    <button
                                        onClick={handleRefreshBalance}
                                        className="ml-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                                        title="Refresh Balance"
                                        disabled={isLoadingBalance}
                                    >
                                        ↻
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    className="p-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg border border-yellow-200 hover:bg-yellow-200 transition-all duration-200 text-sm"
                                    onClick={handleRefreshBalance}
                                    title={`JTN Balance: ${formattedBalance}`}
                                    disabled={isLoadingBalance}
                                >
                                    <Coins className="w-4 h-4" />
                                </Button>
                            )}
                            
                            <Button
                                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                                onClick={() => {
                                    openProfileModal();
                                    // Refresh balance when profile is opened
                                    handleRefreshBalance();
                                }}
                            >
                                <User className="w-4 h-4" />
                                {deviceWidth >= 768 && (
                                    <span className="text-sm">
                                        {users?.fullname || `${account?.address.slice(0, 6)}...${account?.address.slice(-4)}`}
                                    </span>
                                )}
                            </Button>
                            {deviceWidth >= 768 && (
                                <Button
                                    className="px-3 py-2 bg-green-100 text-green-700 font-medium rounded-lg border border-green-200 hover:bg-green-200 transition-all duration-200 text-sm"
                                    onClick={openChainModal}
                                >
                                    {chain?.name}
                                </Button>
                            )}
                            {isDashboard ? (
                                <Button
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    // className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    onClick={() => {
                                        // Trigger map centering functionality
                                        window.dispatchEvent(new CustomEvent('centerMap'));
                                        console.log('Center map clicked');
                                        toast('Zoom User Location...');
                                        // Show a brief toast/feedback
                                        const button = document.querySelector('[title="Center Map"]');
                                        if (button) {
                                            const originalTitle = button.getAttribute('title');
                                            button.setAttribute('title', 'Getting location...');
                                            setTimeout(() => {
                                                button.setAttribute('title', originalTitle || 'Center Map');
                                            }, 2000);
                                        }
                                    }}
                                    title="Center Map"
                                >
                                    <Navigation className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    onClick={() => {
                                        router.push('/dashboard');
                                    }}
                                    title="Dashboard"
                                >
                                    <MapPin className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                className="p-2 text-gray-500 bg-gradient-to-r from-red-100 to-red-200 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                onClick={disconnect}
                                title="Disconnect"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    )
}

export default ConnectButtonCustom