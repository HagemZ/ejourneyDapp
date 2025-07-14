"use client";

import React from "react";
import { X, Award, Target, CheckCircle, Clock, Star, Users } from "lucide-react";

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionModal({ isOpen, onClose }: MissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-heading font-bold text-gray-900">Missions</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Complete challenges and earn rewards for your travel adventures</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">5</p>
                  <p className="text-sm text-blue-600">Active Missions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">12</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-900">3</p>
                  <p className="text-sm text-yellow-600">In Progress</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">2,450</p>
                  <p className="text-sm text-purple-600">Points Earned</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Missions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Missions</h3>
              
              <div className="space-y-4">
                {/* Mission Item */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Photo Explorer</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload 10 high-quality photos to your journeys
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      In Progress
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>7/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Reward: 500 points</span>
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Another Mission */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Social Butterfly</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Receive 50 likes on your journeys
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      New
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>23/50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '46%'}}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Reward: 750 points</span>
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Missions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Missions</h3>
              
              <div className="space-y-4">
                {/* Mission Card */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Location Master</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Visit and document 10 different locations
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">1,000 points</span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Start
                    </button>
                  </div>
                </div>

                {/* Another Mission Card */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Review Expert</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Write detailed reviews for 5 journeys
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">600 points</span>
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                      Start
                    </button>
                  </div>
                </div>

                {/* Third Mission Card */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Community Helper</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Help 20 travelers with comments and tips
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">800 points</span>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Completions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">First Journey</h4>
                    <p className="text-sm text-gray-600 mb-2">Create and publish your first journey</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">Earned: 100 points</span>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Verified Explorer</h4>
                    <p className="text-sm text-gray-600 mb-2">Get your location verified on 3 journeys</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">Earned: 300 points</span>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
