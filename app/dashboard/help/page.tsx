"use client";

import React from "react";
import { HelpCircle, Book, Video, MessageSquare, Search } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              How To Guide
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Learn how to make the most of your JourneyLog experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Start Guide</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect Wallet</h3>
                <p className="text-sm text-gray-600">
                  Connect your Web3 wallet to start your journey
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Profile</h3>
                <p className="text-sm text-gray-600">
                  Set up your traveler profile and preferences
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share Journey</h3>
                <p className="text-sm text-gray-600">
                  Click on the map to share your first adventure
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-sm text-gray-600">
                  Complete missions and earn points for rewards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getting Started */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Book className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">How to connect your wallet</h3>
                  <p className="text-gray-600 text-sm">
                    Step-by-step guide to connecting your Web3 wallet to JourneyLog
                  </p>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Creating your first journey</h3>
                  <p className="text-gray-600 text-sm">
                    Learn how to share your travel experiences with the community
                  </p>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Understanding location verification</h3>
                  <p className="text-gray-600 text-sm">
                    How our location verification system works and why it matters
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Features & Tools</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Using the interactive map</h3>
                  <p className="text-gray-600 text-sm">
                    Navigate and explore journeys on our interactive map interface
                  </p>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Photo and media uploads</h3>
                  <p className="text-gray-600 text-sm">
                    Best practices for uploading photos and videos to your journeys
                  </p>
                </div>
                
                <div className="p-6 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Mission system explained</h3>
                  <p className="text-gray-600 text-sm">
                    How to complete missions and earn rewards for your activities
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Is JourneyLog free to use?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! JourneyLog is completely free to use. You only need a Web3 wallet to get started.
                  </p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">How does location verification work?</h3>
                  <p className="text-gray-600 text-sm">
                    We use GPS coordinates to verify you're actually at the location when creating a journey, ensuring authentic travel experiences.
                  </p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Can I edit my journey after publishing?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes, you can edit your journey details, add more photos, and update information at any time.
                  </p>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What rewards can I earn?</h3>
                  <p className="text-gray-600 text-sm">
                    You can earn points by completing missions, sharing journeys, and engaging with the community. Points can be redeemed for travel vouchers, premium features, and exclusive badges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Need More Help?</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Live Chat</p>
                      <p className="text-sm text-gray-600">Chat with our support team</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">Send us a detailed message</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Popular Articles</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Setting up location permissions</p>
                  <p className="text-xs text-gray-500 mt-1">2 min read</p>
                </div>
                
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Privacy and data security</p>
                  <p className="text-xs text-gray-500 mt-1">3 min read</p>
                </div>
                
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Troubleshooting wallet connection</p>
                  <p className="text-xs text-gray-500 mt-1">4 min read</p>
                </div>
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Video Tutorials</h3>
              </div>
              
              <div className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Getting Started with JourneyLog</h4>
                <p className="text-sm text-gray-600 mb-3">
                  A complete walkthrough of the platform features
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Watch Tutorial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
