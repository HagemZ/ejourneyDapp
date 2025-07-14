"use client";

import React from "react";
import { X, HelpCircle, Book, Video, MessageSquare, Search } from "lucide-react";

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToModal({ isOpen, onClose }: HowToModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-heading font-bold text-gray-900">How To Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Learn how to make the most of your JourneyLog experience</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="text-center bg-white rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Connect Wallet</h4>
                <p className="text-sm text-gray-600">
                  Connect your Web3 wallet to start your journey
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center bg-white rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Profile</h4>
                <p className="text-sm text-gray-600">
                  Set up your traveler profile and preferences
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center bg-white rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Share Journey</h4>
                <p className="text-sm text-gray-600">
                  Click on the map to share your first adventure
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center bg-white rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-blue-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Earn Rewards</h4>
                <p className="text-sm text-gray-600">
                  Complete missions and earn points for rewards
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Getting Started */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Book className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">How to connect your wallet</h4>
                    <p className="text-gray-600 text-sm">
                      Step-by-step guide to connecting your Web3 wallet to JourneyLog
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">Creating your first journey</h4>
                    <p className="text-gray-600 text-sm">
                      Learn how to share your travel experiences with the community
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">Understanding location verification</h4>
                    <p className="text-gray-600 text-sm">
                      How our location verification system works and why it matters
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Video className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Features & Tools</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">Using the interactive map</h4>
                    <p className="text-gray-600 text-sm">
                      Navigate and explore journeys on our interactive map interface
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">Photo and media uploads</h4>
                    <p className="text-gray-600 text-sm">
                      Best practices for uploading photos and videos to your journeys
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-1">Mission system explained</h4>
                    <p className="text-gray-600 text-sm">
                      How to complete missions and earn rewards for your activities
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Is JourneyLog free to use?</h4>
                    <p className="text-gray-600 text-sm">
                      Yes! JourneyLog is completely free to use. You only need a Web3 wallet to get started.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How does location verification work?</h4>
                    <p className="text-gray-600 text-sm">
                      We use GPS coordinates to verify you're actually at the location when creating a journey.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Can I edit my journey after publishing?</h4>
                    <p className="text-gray-600 text-sm">
                      Yes, you can edit your journey details, add more photos, and update information at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Need More Help?</h4>
                
                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-sm text-gray-600">Chat with our support team</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
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

              {/* Video Tutorial */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Video Tutorial</h4>
                
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
                <h5 className="font-medium text-gray-900 mb-2">Getting Started with JourneyLog</h5>
                <p className="text-sm text-gray-600 mb-3">
                  A complete walkthrough of the platform features
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Watch Tutorial
                </button>
              </div>

              {/* Popular Articles */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Popular Articles</h4>
                
                <div className="space-y-2">
                  <div className="bg-white rounded p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">Setting up location permissions</p>
                    <p className="text-xs text-gray-500 mt-1">2 min read</p>
                  </div>
                  
                  <div className="bg-white rounded p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">Privacy and data security</p>
                    <p className="text-xs text-gray-500 mt-1">3 min read</p>
                  </div>
                  
                  <div className="bg-white rounded p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-900">Troubleshooting wallet connection</p>
                    <p className="text-xs text-gray-500 mt-1">4 min read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
