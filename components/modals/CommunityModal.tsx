"use client";

import React from "react";
import { X, Users, MessageCircle, Heart, Star, TrendingUp, Award } from "lucide-react";

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-heading font-bold text-gray-900">Community</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Connect with fellow travelers and explore the world together</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">12,453</p>
                  <p className="text-sm text-blue-600">Active Members</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">8,921</p>
                  <p className="text-sm text-green-600">Discussions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">45,672</p>
                  <p className="text-sm text-purple-600">Journey Likes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-900">15,234</p>
                  <p className="text-sm text-yellow-600">Reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trending Discussions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trending Discussions</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Discussion Item */}
                  <div className="bg-white rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                        alt="Sarah"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Best hidden gems in Southeast Asia
                          </h4>
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
                  <div className="bg-white rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                        alt="Alex"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Solo travel safety tips for beginners
                          </h4>
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
                  <div className="bg-white rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=emma"
                        alt="Emma"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Budget travel in Europe: €30/day challenge
                        </h4>
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
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors This Month</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contributor 1 */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-3">
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
                        <h4 className="font-semibold text-gray-900">Maya Chen</h4>
                        <p className="text-sm text-gray-600">Travel Photographer</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">15 journeys</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">89 helpful replies</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contributor 2 */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-3">
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
                        <h4 className="font-semibold text-gray-900">James Wilson</h4>
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Community Guidelines</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Be respectful and kind to all travelers</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Share authentic travel experiences</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Help others with constructive advice</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">Report inappropriate content</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
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
                  
                  <div className="flex items-center space-x-3">
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
                  
                  <div className="flex items-center space-x-3">
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Popular Tags</h4>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">#solo-travel</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">#budget-tips</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">#photography</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">#food</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">#adventure</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">#culture</span>
                </div>
              </div>

              {/* Join Discussion CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
                <h4 className="font-semibold mb-2">Join the Conversation</h4>
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
    </div>
  );
}
