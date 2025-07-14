"use client";

import React from "react";
import { X, FileText, Calendar, Radio, MapPin, Clock, Settings } from "lucide-react";

interface MyJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyJourneyModal({ isOpen, onClose }: MyJourneyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-heading font-bold text-gray-900">My Journey</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Manage all your journey drafts, scheduled posts, and live content</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">3</p>
                  <p className="text-sm text-blue-600">Draft Journeys</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">2</p>
                  <p className="text-sm text-orange-600">Scheduled</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Radio className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">1</p>
                  <p className="text-sm text-green-600">Live Journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Categories */}
          <div className="space-y-6">
            {/* Draft Journeys */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Draft Journeys</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">3</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Hidden Waterfall in Bali</h4>
                      <p className="text-sm text-gray-600 mb-2">A secluded waterfall discovered during my morning hike...</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Last edited: 2 hours ago</span>
                        <span>Progress: 75%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">Edit</button>
                      <button className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm">Publish</button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Sunrise at Mount Bromo</h4>
                      <p className="text-sm text-gray-600 mb-2">Early morning adventure to catch the spectacular sunrise...</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Last edited: 1 day ago</span>
                        <span>Progress: 45%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">Edit</button>
                      <button className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-sm cursor-not-allowed">Publish</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduled Journeys */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Journeys</h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">2</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Coffee Plantation Tour Bandung</h4>
                      <p className="text-sm text-gray-600 mb-2">A comprehensive guide to the best coffee plantations...</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Scheduled: Tomorrow, 9:00 AM</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">Publishing Soon</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded text-sm">Edit Schedule</button>
                      <button className="px-3 py-1 bg-orange-600 text-white hover:bg-orange-700 rounded text-sm">Publish Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Journeys */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Radio className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Journeys</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">1</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Rice Terraces Jatiluwih</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                          <Radio className="w-3 h-3 mr-1" />
                          Live
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Breathtaking views of the UNESCO World Heritage rice terraces...</p>
                      
                      {/* Live Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-2">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">2,451</p>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">387</p>
                          <p className="text-xs text-gray-500">Likes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">129</p>
                          <p className="text-xs text-gray-500">Comments</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">45</p>
                          <p className="text-xs text-gray-500">Shares</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm">Analytics</button>
                      <button className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded text-sm">View Journey</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create New Journey
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Manage All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
