"use client";

import React from "react";
import { Award, Target, CheckCircle, Clock, Star, Users } from "lucide-react";

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Missions
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Complete challenges and earn rewards for your travel adventures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Missions</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">2,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Missions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Active Missions</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Mission Item */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Photo Explorer
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
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
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Social Butterfly
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
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

          {/* Completed Missions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Completions</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Completed Mission Item */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      First Journey
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Create and publish your first journey
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Completed
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Earned: 100 points</span>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>

              {/* Another Completed Mission */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Verified Explorer
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Get your location verified on 3 journeys
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Completed
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Earned: 300 points</span>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Missions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Available Missions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mission Card */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
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
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
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
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
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
      </div>
    </div>
  );
}
