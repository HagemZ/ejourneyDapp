"use client";

import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function ScheduledJourneysPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Scheduled Journeys
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Your upcoming journey publications and planned adventures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Next Month</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Journeys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Publications</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* Scheduled Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Coffee Plantation Tour Bandung
                    </h3>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      Publishing Soon
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    A comprehensive guide to the best coffee plantations in Bandung with tasting notes and local insights...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Scheduled: Tomorrow, 9:00 AM</span>
                    <span>•</span>
                    <span>Status: Ready</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit Schedule
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors">
                    Publish Now
                  </button>
                </div>
              </div>
            </div>

            {/* Another Scheduled Journey Item */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Island Hopping Thousand Islands
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    A complete guide to exploring the beautiful Thousand Islands near Jakarta with budget tips and hidden gems...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Scheduled: Jan 20, 2025, 10:00 AM</span>
                    <span>•</span>
                    <span>Status: Ready</span>
                  </div>
                </div>
                <div className="ml-6 flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit Schedule
                  </button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg">
                    Scheduled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State (when no scheduled journeys) */}
        {false && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scheduled journeys</h3>
            <p className="text-gray-600 mb-6">
              Schedule your draft journeys to be published at optimal times
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Schedule Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
