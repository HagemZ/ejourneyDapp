"use client";

import React from "react";
import { Radio, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function LiveJourneysPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Radio className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Live Journeys
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Your published journeys currently engaging with the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Radio className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live Journeys</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">2,451</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">387</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Comments</p>
                <p className="text-2xl font-bold text-gray-900">129</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Journeys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Journeys</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* Live Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Rice Terraces Jatiluwih
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                      <Radio className="w-3 h-3 mr-1" />
                      Live
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Breathtaking views of the UNESCO World Heritage rice terraces in Bali with the best photo spots and timing...
                  </p>
                  
                  {/* Engagement Stats */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>2,451 views</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span>387 likes</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>129 comments</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Share2 className="w-4 h-4" />
                      <span>45 shares</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Published: 3 days ago</span>
                    <span>•</span>
                    <span>Last activity: 2 hours ago</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    View Analytics
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                    View Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah M.</span> viewed your journey "Rice Terraces Jatiluwih"
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Alex K.</span> liked your journey "Rice Terraces Jatiluwih"
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Emma L.</span> commented: "Amazing photos! When is the best time to visit?"
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State (when no live journeys) */}
        {false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No live journeys</h3>
            <p className="text-gray-600 mb-6">
              Publish your first journey to start engaging with the community
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Publish Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
