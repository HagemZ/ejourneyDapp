"use client";

import React from "react";
import { X, Gift, Star, Trophy, Coins, Package } from "lucide-react";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardModal({ isOpen, onClose }: RewardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-heading font-bold text-gray-900">Rewards</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Redeem your points for exciting rewards and exclusive benefits</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Points Balance */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Your Points Balance</h3>
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6" />
                  <span className="text-3xl font-bold">2,450</span>
                  <span className="text-lg">points</span>
                </div>
                <p className="mt-2 opacity-90">Keep exploring to earn more points!</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-75">Rank</p>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-lg font-semibold">Explorer</span>
                </div>
                <p className="text-sm opacity-75 mt-1">550 points to next rank</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Rewards */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Rewards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reward Item */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Gift className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Travel Voucher $50
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Discount voucher for your next adventure
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">1,500 points</span>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Another Reward */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Premium Badge
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Exclusive premium badge for your profile
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">800 points</span>
                        </div>
                        <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Reward */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Travel Kit
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Essential travel accessories starter kit
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">2,000 points</span>
                        </div>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fourth Reward */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Feature Spotlight
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Get your journey featured on the homepage
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">1,200 points</span>
                        </div>
                        <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Redemption History */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Redemptions</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Gift className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Travel Voucher $25</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Premium Badge</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Point Earning Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Earn More Points</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Complete missions: up to 1,000 pts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Publish journeys: 200 pts each</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Get verified: 300 pts each</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">Daily login: 10 pts</span>
                  </div>
                </div>
              </div>

              {/* Next Rank Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Rank Progress</h4>
                
                <div className="text-center mb-4">
                  <Trophy className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Explorer</p>
                  <p className="text-sm text-gray-500">Current Rank</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to Adventurer</span>
                    <span>2,450/3,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center">
                  550 more points to unlock exclusive Adventurer rewards!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
