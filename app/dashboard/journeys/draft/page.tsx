"use client";

import React from "react";
import { FileText, Calendar, Clock } from "lucide-react";

export default function DraftJourneysPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Draft Journeys
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Your journey ideas waiting to be shared with the world
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Drafts</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
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
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ready to Publish</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Draft Journeys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Draft Journeys</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* Draft Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hidden Waterfall in Bali
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A secluded waterfall discovered during my morning hike. The crystal clear water and peaceful surroundings made it...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last edited: 2 hours ago</span>
                    <span>•</span>
                    <span>Progress: 75%</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* Another Draft Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sunrise at Mount Bromo
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Early morning adventure to catch the spectacular sunrise over the volcanic landscape...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last edited: 1 day ago</span>
                    <span>•</span>
                    <span>Progress: 45%</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* Third Draft Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Street Food Tour Jakarta
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Exploring the vibrant street food scene in Jakarta's old town district...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last edited: 3 days ago</span>
                    <span>•</span>
                    <span>Progress: 20%</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State (when no drafts) */}
        {false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts yet</h3>
            <p className="text-gray-600 mb-6">
              Start creating your first journey draft to save your progress
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create New Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
