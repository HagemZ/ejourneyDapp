"use client";

import React from "react";
import { Users, MessageCircle, Heart, Star, TrendingUp, Award } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Community
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Connect with fellow travelers and explore the world together
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">12,453</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Discussions</p>
                <p className="text-2xl font-bold text-gray-900">8,921</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Journey Likes</p>
                <p className="text-2xl font-bold text-gray-900">45,672</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">15,234</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Discussions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Trending Discussions</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Discussion Item */}
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                      alt="Sarah"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Best hidden gems in Southeast Asia
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Hot
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Looking for recommendations for off-the-beaten-path destinations in Thailand, Vietnam, and Indonesia...
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Sarah Mitchell</span>
                        <span>•</span>
                        <span>24 replies</span>
                        <span>•</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Another Discussion */}
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                      alt="Alex"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Solo travel safety tips for beginners
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Sharing my experience and tips for first-time solo travelers, especially for safety and planning...
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Alex Rivera</span>
                        <span>•</span>
                        <span>18 replies</span>
                        <span>•</span>
                        <span>5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Discussion */}
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
                      alt="Emma"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Budget travel in Europe: €30/day challenge
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Successfully completed a 2-week Europe trip with just €30 per day. Here's how I did it...
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>by Emma Johnson</span>
                        <span>•</span>
                        <span>31 replies</span>
                        <span>•</span>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Top Contributors This Month</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contributor 1 */}
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=contributor1"
                        alt="Maya Chen"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">1</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Maya Chen</h3>
                      <p className="text-sm text-gray-600">Travel Photographer</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500">15 journeys</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">89 helpful replies</span>
                      </div>
                    </div>
                  </div>

                  {/* Contributor 2 */}
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=contributor2"
                        alt="James Wilson"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">2</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">James Wilson</h3>
                      <p className="text-sm text-gray-600">Adventure Guide</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500">12 journeys</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">76 helpful replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Guidelines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Community Guidelines</h3>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Be respectful and kind to all travelers</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Share authentic travel experiences</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Help others with constructive advice</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span className="text-gray-700">Report inappropriate content</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      New discussion: "Best time to visit Japan"
                    </p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Maya Chen earned "Photography Master" badge
                    </p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Weekly challenge: "Hidden Waterfalls" started
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Popular Tags</h3>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">#solo-travel</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">#budget-tips</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">#photography</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">#food</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">#adventure</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">#culture</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">#backpacking</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">#nature</span>
                </div>
              </div>
            </div>

            {/* Join Discussion */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Join the Conversation</h3>
              <p className="text-sm opacity-90 mb-4">
                Share your travel stories and connect with fellow explorers
              </p>
              <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Start Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
