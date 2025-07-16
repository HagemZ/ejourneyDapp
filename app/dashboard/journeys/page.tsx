"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Calendar, Clock, MapPin, Edit, Eye, AlertCircle, FileText, Radio, Plus, ArrowLeft, Shield, User } from "lucide-react";
import { getUserJourneysByType, type JourneyCounts } from "@/services/journeyService";
import { Journey } from "../../../types";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";
import useGetUserData from "@/hooks/useAddress";

export default function JourneysOverviewPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { users: userData } = useGetUserData();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'scheduled' | 'live'>('all');
  const [stats, setStats] = useState<JourneyCounts>({
    total: 0,
    draft: 0,
    scheduled: 0,
    live: 0
  });

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
                To access your journeys and travel data, please connect your wallet using the button above.
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
      fetchJourneys();
      // Fetch stats separately on first load only
      if (stats.total === 0) {
        fetchStats();
      }
    }
  }, [activeTab, isConnected, address, userData?.id]); // Add userData dependency

  const fetchStats = async () => {
    try {
      // Use the user's registered ID if available, otherwise use wallet address
      let userId = address; // Default to wallet address
      
      if (userData?.id) {
        // If user is registered, use their registered user ID
        userId = userData.id;
      }
      
      if (!userId) {
        console.log('No userId available for stats');
        return;
      }
      
      console.log('Fetching stats for userId:', userId);
      // Fetch ALL journeys to calculate correct stats
      const response = await getUserJourneysByType(userId, undefined, 50, 0);
      
      if (response.success) {
        const allJourneys = response.data;
        const counts = {
          total: allJourneys.length,
          draft: allJourneys.filter(j => j.shareType === 'draft').length,
          scheduled: allJourneys.filter(j => j.shareType === 'scheduled').length,
          live: allJourneys.filter(j => j.shareType === 'live').length
        };
        setStats(counts);
        console.log('Stats updated:', counts);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      
      // Use the user's registered ID if available, otherwise use wallet address
      let userId = address; // Default to wallet address
      
      if (userData?.id) {
        // If user is registered, use their registered user ID
        userId = userData.id;
      }
      
      if (!userId) {
        console.log('No userId available for fetching journeys');
        setLoading(false);
        return;
      }
      
      console.log('Fetching journeys for userId:', userId);
      const shareType = activeTab === 'all' ? undefined : activeTab;
      const response = await getUserJourneysByType(userId, shareType, 50, 0);
      
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
        
        setJourneys(formattedJourneys);
        
        // Only calculate stats if we're on 'all' tab to avoid incorrect counts
        if (activeTab === 'all') {
          const counts = {
            total: formattedJourneys.length,
            draft: formattedJourneys.filter(j => j.shareType === 'draft').length,
            scheduled: formattedJourneys.filter(j => j.shareType === 'scheduled').length,
            live: formattedJourneys.filter(j => j.shareType === 'live').length
          };
          setStats(counts);
        }
      }
    } catch (error) {
      console.error("Error fetching journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (journeyId: string, shareType: string) => {
    if (shareType === 'draft') {
      router.push(`/dashboard/journeys/draft/${journeyId}/edit`);
    } else if (shareType === 'scheduled') {
      router.push(`/dashboard/journeys/scheduled/${journeyId}/edit`);
    }
  };

  const handleView = (journeyId: string) => {
    router.push(`/journey/${journeyId}`);
  };

  const getStatusIcon = (shareType: string) => {
    switch (shareType) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'live':
        return <Radio className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (shareType: string) => {
    switch (shareType) {
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-orange-100 text-orange-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Loading journeys...</div>
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
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">
                My Journeys
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
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                My Journeys
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage all your travel experiences and stories
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Journey
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Journeys</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Radio className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Live</p>
                <p className="text-2xl font-bold text-gray-900">{stats.live}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { key: 'all', label: 'All Journeys', count: stats.total },
                { key: 'draft', label: 'Drafts', count: stats.draft },
                { key: 'scheduled', label: 'Scheduled', count: stats.scheduled },
                { key: 'live', label: 'Live', count: stats.live }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label} ({tab.count})</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]} ({tab.count})</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Journeys List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {journeys.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No journeys found</h3>
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? "You haven't created any journeys yet." 
                  : `No ${activeTab} journeys found.`
                }
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Journey
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {journeys.map((journey) => (
                <div key={journey.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {journey.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(journey.shareType)}`}>
                          {getStatusIcon(journey.shareType)}
                          <span className="ml-1">{journey.shareType.charAt(0).toUpperCase() + journey.shareType.slice(1)}</span>
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{journey.location.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span>{journey.createdAt.toLocaleDateString()}</span>
                        </div>
                        {journey.scheduledAt && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="text-xs">Scheduled: {journey.scheduledAt.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 mb-3">
                        {journey.description}
                      </p>
                      
                      {journey.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    </div>
                    
                    <div className="flex sm:flex-col sm:ml-6 space-x-2 sm:space-x-0 sm:space-y-2">
                      {(journey.shareType === 'draft' || journey.shareType === 'scheduled') && (
                        <button
                          onClick={() => handleEdit(journey.id, journey.shareType)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleView(journey.id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline ml-1">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
