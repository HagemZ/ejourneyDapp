'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, MapPin, Users } from 'lucide-react';
import { getAITravelTrends } from '../utils/aiSummarizer';

interface AIInsightsSectionProps {
  className?: string;
}

export default function AIInsightsSection({ className = '' }: AIInsightsSectionProps) {
  const [trends, setTrends] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const result = await getAITravelTrends();
      if (result.success && result.trends) {
        setTrends(result.trends);
        setMetadata(result.metadata);
      }
    } catch (error) {
      console.error('Error loading AI travel trends:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">AI Travel Insights</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover trending destinations and travel patterns from our community, 
            powered by AI analysis of real traveler experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Trends Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Community Travel Trends
                </h3>
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                )}
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/6"></div>
                </div>
              ) : trends ? (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div className="whitespace-pre-line leading-relaxed">
                    {trends}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  AI insights will appear here as more travelers share their journeys.
                </p>
              )}
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Community Stats</h3>
              </div>
              
              {metadata ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Journeys</span>
                    <span className="font-bold text-lg text-blue-600">
                      {metadata.totalJourneys || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unique Locations</span>
                    <span className="font-bold text-lg text-green-600">
                      {metadata.uniqueLocations || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-lg text-yellow-600">
                        {metadata.averageRating || '0.0'}
                      </span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loading ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Loading...</span>
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Loading...</span>
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Statistics will be available when community data is analyzed.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Join the Community</h3>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Help us improve AI insights by sharing your travel experiences!
              </p>
              <button 
                className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
                onClick={() => {
                  // Navigate to journey creation
                  const event = new CustomEvent('openJourneyModal');
                  window.dispatchEvent(event);
                }}
              >
                Share Your Journey
              </button>
            </div>
          </div>
        </div>

        {metadata?.generatedAt && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Last updated: {new Date(metadata.generatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
}
