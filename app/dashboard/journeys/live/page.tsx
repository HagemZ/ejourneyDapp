
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Radio, Plus, Eye, MapPin, Calendar, Clock, Heart, MessageCircle, Share2, ArrowLeft, Shield, User } from "lucide-react";
import { getUserJourneysByType, getCurrentUserId } from "@/services/journeyService";
import { Journey } from "../../../../types";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";

export default function LiveJourneysPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [liveJourneys, setLiveJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // If wallet not connected, show connection prompt instead of redirecting
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </button>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Wallet Required</span>
                </div>
              </div>
              <ConnectButtonCustom />
            </div>
          </div>

          {/* Connection Required Message */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Radio className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To access your live journeys, please connect your wallet using the button above.
              </p>
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchLiveJourneys();
  }, []);

  const fetchLiveJourneys = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      const response = await getUserJourneysByType(userId, 'live', 50, 0);
      
      if (response.success) {
        const formattedJourneys = response.data.map(journey => ({
          id: journey.id,
          userId: journey.userId,
          title: journey.title,
          description: journey.description,
          location: {
            name: journey.locationName || '',
            coordinates: [
              parseFloat(journey.locationLng || '0'),
              parseFloat(journey.locationLat || '0')
            ] as [number, number],
            country: journey.locationName?.split(',').pop()?.trim() || '',
            city: journey.locationName?.split(',')[0]?.trim() || ''
          },
          images: Array.isArray(journey.images) ? journey.images : (journey.images ? [journey.images] : []),
          rating: Number(journey.rating),
          tags: Array.isArray(journey.tags) ? journey.tags : (journey.tags ? [journey.tags] : []),
          createdAt: new Date(journey.createdAt),
          updatedAt: new Date(journey.updatedAt),
          verifiedLocation: Boolean(journey.verifiedLocation),
          totalVotes: Number(journey.totalVotes || 0),
          averageRating: Number(journey.averageRating || 0),
          reviewCount: Number(journey.reviewCount || 0),
          shareType: journey.shareType,
          scheduledAt: journey.scheduledAt ? new Date(journey.scheduledAt) : null,
          status: journey.status
        }));
        
        setLiveJourneys(formattedJourneys);
      }
    } catch (error) {
      console.error("Error fetching live journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (journeyId: string) => {
    router.push(`/journey/${journeyId}`);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async (journeyId: string) => {
    const journey = liveJourneys.find(j => j.id === journeyId);
    if (!journey) return;

    const shareUrl = `${window.location.origin}/journey/${journeyId}`;
    const shareData = {
      title: journey.title || 'Amazing Journey',
      text: `Check out this amazing travel journey: "${journey.title}" in ${journey.location.name}`,
      url: shareUrl,
    };

    try {
      // Try native sharing first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showToast('Journey shared successfully!');
        return;
      }
    } catch (error) {
      console.log('Native sharing failed, using fallback');
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Journey link copied to clipboard!');
    } catch (error) {
      // Final fallback: Show URL in alert
      showToast(`Share link: ${shareUrl}`, 'success');
    }
  };

  const getTimesSincePublished = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Less than 1 hour ago';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Loading live journeys...</div>
      </div>
    );
  }

  const currentUserId = getCurrentUserId();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Protected Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">
                Live Journeys
              </h1>
            </div>

            {/* User Info and Wallet */}
            <div className="flex items-center space-x-4">
              {/* User ID Display */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  ID: {currentUserId.slice(0, 8)}...
                </span>
              </div>
              
              {/* Wallet Protection Status */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Protected
                </span>
              </div>

              {/* Wallet Connect Button */}
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                  Live Journeys
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600">
                Your published journeys sharing stories with the world • {liveJourneys.length} live
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Create New Journey</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Live Journeys */}
        {liveJourneys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No live journeys yet</h3>
            <p className="text-gray-500 mb-6">
              Publish your first journey to start sharing your travel experiences with the community.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Your First Journey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {liveJourneys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="h-40 sm:h-48 bg-gray-200 relative">
                  {journey.images && journey.images.length > 0 ? (
                    <img
                      src={journey.images[0]}
                      alt={journey.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                      <Radio className="w-3 h-3 mr-1" />
                      Live
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      <Heart className="w-3 h-3" />
                      <span>{journey.totalVotes}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {journey.title || 'Untitled Journey'}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{journey.location.name || 'Location not set'}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {journey.description || 'No description available...'}
                  </p>
                  
                  {/* Rating */}
                  {journey.rating > 0 && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < journey.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{journey.rating}/5</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {journey.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {journey.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {journey.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{journey.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{journey.totalVotes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        <span>{journey.reviewCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{getTimesSincePublished(journey.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleView(journey.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">View Journey</span>
                      <span className="sm:hidden">View</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(journey.id)}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Summary */}
        {liveJourneys.length > 0 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Performance Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-800">
                      {liveJourneys.reduce((sum, journey) => sum + journey.totalVotes, 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-green-600">Total Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-800">
                      {liveJourneys.reduce((sum, journey) => sum + journey.reviewCount, 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-green-600">Total Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-800">
                      {(liveJourneys.reduce((sum, journey) => sum + journey.averageRating, 0) / liveJourneys.length).toFixed(1)}
                    </p>
                    <p className="text-xs sm:text-sm text-green-600">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-800">{liveJourneys.length}</p>
                    <p className="text-xs sm:text-sm text-green-600">Published Journeys</p>
                  </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {liveJourneys.length > 0 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">🚀 Live Journey Tips</h3>
            <ul className="text-green-800 text-xs sm:text-sm space-y-1">
              <li>• Live journeys are visible to the public and can receive votes and reviews</li>
              <li>• Share your journeys on social media to increase visibility</li>
              <li>• Respond to reviews to engage with your audience</li>
              <li>• High-quality photos and detailed descriptions get more engagement</li>
            </ul>
          </div>
        )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              toast.type === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
