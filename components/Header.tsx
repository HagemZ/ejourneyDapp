"use client";
import React from "react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { useAccount } from "wagmi";
import ConnectButtonCustom from "./ConnectButtonCustom";

export default function Header() {

  const router = useRouter();
  const { deviceWidth } = useResponsive();
  // console.log(deviceWidth);
  const { address } = useAccount();

  return (
    <header className="fixed  top-0 left-0 right-0 z-90 bg-white/30 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            {deviceWidth >= 768 && (
              <h1 className="text-xl font-heading font-bold text-gray-900">
                eJourney Dapp
              </h1>
            )}
          </div>



          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {address ? (
              <ConnectButtonCustom />
            ) : (
              <button  
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => router.push("/dashboard")}
              >
                Start Here
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
