'use client'
import React from 'react'
import { ConnectButton } from "@xellar/kit";
import useResponsive from "@/hooks/useResponsive";
import { MapPin, User, LogOut, Navigation, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from 'sonner';
import useGetUserData from "@/hooks/useAddress";


const ConnectButtonCustom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { deviceWidth } = useResponsive();
  const { users } = useGetUserData();
  
  const isDashboard = pathname === '/dashboard';
  //   console.log(deviceWidth);

    return (
        <div>
            <ConnectButton.Custom>
                {({ openConnectModal, disconnect, isConnected, openChainModal, openProfileModal, account, chain }) => {
                    return !isConnected ? (
                        <Button
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={openConnectModal}
                        >
                            Connect Wallet
                        </Button>
                      
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Button
                                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                                onClick={openProfileModal}
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
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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