"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { FileText, Plus, Edit, Trash2, MapPin, Clock, Save, ArrowLeft, Shield, User } from "lucide-react";
import { getUserJourneysByType } from "@/services/journeyService";
import useGetUserData from "@/hooks/useAddress";
import { Journey } from "@/types";
import { format } from "date-fns";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";

export default function DraftJourneysPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { users: userData } = useGetUserData();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      
      // Use the user's registered ID if available, otherwise use wallet address
      let userId: string = address || ''; // Default to wallet address
      
      if (userData?.id) {
        // If user is registered, use their registered user ID
        userId = userData.id;
      }
      
      if (!userId) {
        console.log('No userId available for fetching drafts');
        setLoading(false);
        return;
      }
      
      console.log('Fetching drafts for userId:', userId);
      const response = await getUserJourneysByType(userId, 'draft', 50, 0);
      
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
          status: journey.status,
            voteScore: Number(journey.voteScore || 0)
        }));
        
        setJourneys(formattedJourneys);
      } else {
        console.error('Failed to fetch draft journeys:', 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching draft journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when wallet is connected and we have user data (or address fallback)
    if (isConnected && address) {
      fetchDrafts();
    }
  }, [isConnected, address, userData?.id]); // Add dependencies

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
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To access your draft journeys, please connect your wallet using the button above.
              </p>
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (journeyId: string) => {
    router.push(`/dashboard/journeys/draft/${journeyId}/edit`);
  };

  const handleDelete = async (journeyId: string) => {
    if (confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      try {
        // TODO: Implement delete API call
        console.log("Delete journey:", journeyId);
        // Refresh the list after deletion
        fetchDrafts();
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    }
  };

  const handlePublish = (journeyId: string) => {
    router.push(`/dashboard/journeys/draft/${journeyId}/publish`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Loading drafts...</div>
      </div>
    );
  }

  // Show loading if wallet not connected
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Connecting to wallet...</div>
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">
                Draft Journeys
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
          <div className="flex items-center justify-between">
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
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  Draft Journeys
                </h1>
              </div>
              <p className="text-lg text-gray-600">
                Continue working on your travel stories • {journeys.length} draft{journeys.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Journey
            </button>
          </div>
        </div>

        {/* Drafts Grid */}
        {journeys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts yet</h3>
            <p className="text-gray-500 mb-6">
              Start creating your travel stories. Save them as drafts and publish when ready.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Journey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((draft) => (
              <div key={draft.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  {draft.images && draft.images.length > 0 ? (
                    <img
                      src={draft.images[0]}
                      alt={draft.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      Draft
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {draft.title || 'Untitled Journey'}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{draft.location.name || 'Location not set'}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {draft.description || 'No description yet...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Created {draft.createdAt.toLocaleDateString()}</span>
                    </div>
                    {draft.tags.length > 0 && (
                      <span>{draft.tags.length} tag{draft.tags.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>

                  {/* Tags */}
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {draft.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {draft.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{draft.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(draft.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Continue Editing
                    </button>
                    
                    <button
                      onClick={() => handlePublish(draft.id)}
                      className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
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
        {journeys.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Click "Continue Editing" to add more details, photos, or location information</li>
              <li>• Use the save button to quickly publish or schedule your journey</li>
              <li>• Add tags to help others discover your travel stories</li>
              <li>• Complete the location details for better visibility</li>
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
