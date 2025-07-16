"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, Eye, AlertCircle, ArrowLeft, Shield, User } from "lucide-react";
import { getUserJourneysByType } from "@/services/journeyService";
import { Journey } from "../../../../types";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";
import useGetUserData from "@/hooks/useAddress";

export default function ScheduledJourneysPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { users: userData } = useGetUserData();
  const [scheduledJourneys, setScheduledJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

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
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To access your scheduled journeys, please connect your wallet using the button above.
              </p>
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Only fetch when wallet is connected and we have user data (or address fallback)
    if (isConnected && address) {
      fetchScheduledJourneys();
    }
  }, [isConnected, address, userData?.id]); // Add dependencies

  const fetchScheduledJourneys = async () => {
    try {
      setLoading(true);
      
      // Use the user's registered ID if available, otherwise use wallet address
      let userId = address; // Default to wallet address
      
      if (userData?.id) {
        // If user is registered, use their registered user ID
        userId = userData.id;
      }
      
      if (!userId) {
        console.log('No userId available for fetching scheduled journeys');
        setLoading(false);
        return;
      }
      
      console.log('Fetching scheduled journeys for userId:', userId);
      const response = await getUserJourneysByType(userId, 'scheduled', 50, 0);
      
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
        
        setScheduledJourneys(formattedJourneys);
      }
    } catch (error) {
      console.error("Error fetching scheduled journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (journeyId: string) => {
    router.push(`/dashboard/journeys/scheduled/${journeyId}/edit`);
  };

  const handleView = (journeyId: string) => {
    router.push(`/journey/${journeyId}`);
  };

  const handlePublishNow = async (journeyId: string) => {
    if (confirm("Are you sure you want to publish this journey immediately?")) {
      try {
        // TODO: Implement publish now API call
        console.log("Publish now:", journeyId);
        // Refresh the list after publishing
        fetchScheduledJourneys();
      } catch (error) {
        console.error("Error publishing journey:", error);
      }
    }
  };

  const handleDelete = async (journeyId: string) => {
    if (confirm("Are you sure you want to delete this scheduled journey? This action cannot be undone.")) {
      try {
        // TODO: Implement delete API call
        console.log("Delete journey:", journeyId);
        // Refresh the list after deletion
        fetchScheduledJourneys();
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    }
  };

  const getTimeUntilScheduled = (scheduledAt: Date | null) => {
    if (!scheduledAt) return 'No date set';
    
    const now = new Date();
    const diff = scheduledAt.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Less than 1 hour';
  };

  const isOverdue = (scheduledAt: Date | null) => {
    if (!scheduledAt) return false;
    return scheduledAt.getTime() < new Date().getTime();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Loading scheduled journeys...</div>
      </div>
    );
  }

  // Get current user ID for display
  const currentUserId = userData?.id || address || 'Unknown User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Protected Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">
                Scheduled Journeys
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
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                  Scheduled Journeys
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600">
                Your journeys waiting to be published • {scheduledJourneys.length} scheduled
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Create New Journey</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Scheduled Journeys */}
        {scheduledJourneys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scheduled journeys</h3>
            <p className="text-gray-500 mb-6">
              Schedule your journey publications to maintain a consistent sharing timeline.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Create Your First Journey
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledJourneys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      {/* Image */}
                      <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {journey.images && journey.images.length > 0 ? (
                          <img
                            src={journey.images[0]}
                            alt={journey.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {journey.title || 'Untitled Journey'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Scheduled
                            </span>
                            {isOverdue(journey.scheduledAt || null) && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{journey.location.name || 'Location not set'}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-xs sm:text-sm">
                              {journey.scheduledAt 
                                ? `Scheduled for ${journey.scheduledAt.toLocaleDateString()} at ${journey.scheduledAt.toLocaleTimeString()}`
                                : 'No schedule set'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                          {journey.description || 'No description yet...'}
                        </p>
                        
                        {/* Tags */}
                        {journey.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {journey.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                            {journey.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{journey.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Schedule Info */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created {journey.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>
                            {journey.scheduledAt && (
                              isOverdue(journey.scheduledAt) 
                                ? 'Overdue for publishing' 
                                : `Publishing in ${getTimeUntilScheduled(journey.scheduledAt)}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleView(journey.id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Preview</span>
                      <span className="sm:hidden">View</span>
                    </button>
                    
                    <button
                      onClick={() => handleEdit(journey.id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-orange-300 text-orange-600 rounded-lg text-sm font-medium bg-white hover:bg-orange-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handlePublishNow(journey.id)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <span className="hidden sm:inline">Publish Now</span>
                      <span className="sm:hidden">Publish</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(journey.id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium bg-white hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Tips */}
        {scheduledJourneys.length > 0 && (
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">📅 Schedule Management Tips</h3>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Scheduled journeys will automatically publish at the set date and time</li>
              <li>• Use "Publish Now" to release a journey immediately without waiting</li>
              <li>• Edit scheduled journeys anytime before they go live</li>
              <li>• Overdue journeys need manual publishing or rescheduling</li>
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
