"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, FileText, Calendar, Radio, MapPin, Clock, Settings, Search, Filter } from "lucide-react";
import { getUserJourneysByType, getCurrentUserId, type JourneyCounts } from "@/services/journeyService";

// Simulate database journey data
interface DatabaseJourney {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'live';
  lastEdited: string;
  progress?: number;
  scheduledDate?: string;
  stats?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
  userId: string;
}

// Mock database data
const mockJourneys: DatabaseJourney[] = [
  {
    id: '42625bef-06c2-49af',
    title: 'Melati Mas',
    description: 'Tempat ini ramai sekali yang berjualan khususnya di malam hari',
    status: 'draft',
    lastEdited: '2 hours ago',
    progress: 75,
    createdAt: '2025-07-14T13:40:06.000Z',
    userId: '1a2cc4fe-ca35-4eb0'
  },
  {
    id: '77f021af-9d3d-4eab',
    title: 'Hidden Waterfall in Bali',
    description: 'A secluded waterfall discovered during my morning hike through the tropical forest.',
    status: 'draft',
    lastEdited: '1 day ago',
    progress: 45,
    createdAt: '2025-07-15T12:11:02.000Z',
    userId: 'user123'
  }
];

interface MyJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterStatus?: 'draft' | 'scheduled' | 'live' | null;
}

export default function MyJourneyModal({ isOpen, onClose, filterStatus }: MyJourneyModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilter, setLocalFilter] = useState<'all' | 'draft' | 'scheduled' | 'live'>('all');
  const [journeys, setJourneys] = useState<DatabaseJourney[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [journeyCounts, setJourneyCounts] = useState<JourneyCounts>({
    live: 0,
    draft: 0,
    scheduled: 0,
    total: 0
  });

  // Set local filter based on props
  useEffect(() => {
    if (filterStatus) {
      setLocalFilter(filterStatus);
    } else {
      setLocalFilter('all');
    }
  }, [filterStatus]);

  // Load journeys when filter changes or modal opens
  useEffect(() => {
    if (isOpen) {
      loadJourneys();
    }
  }, [isOpen, localFilter]);

  const loadJourneys = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      
      // Load journeys based on current filter
      const shareType = localFilter === 'all' ? undefined : localFilter;
      const response = await getUserJourneysByType(userId, shareType, 50, 0);
      
      if (response.success) {
        // Convert API response to our local format
        const convertedJourneys: DatabaseJourney[] = response.data.map(journey => ({
          id: journey.id,
          title: journey.title,
          description: journey.description,
          status: journey.shareType,
          lastEdited: formatLastEdited(journey.updatedAt),
          progress: journey.shareType === 'draft' ? Math.floor(Math.random() * 100) : undefined,
          scheduledDate: journey.scheduledAt ? formatScheduledDate(journey.scheduledAt) : undefined,
          stats: journey.shareType === 'live' ? {
            views: Math.floor(Math.random() * 5000) + 1000,
            likes: Math.floor(Math.random() * 500) + 100,
            comments: Math.floor(Math.random() * 200) + 50,
            shares: Math.floor(Math.random() * 100) + 10
          } : undefined,
          createdAt: journey.createdAt,
          userId: journey.userId
        }));
        
        setJourneys(convertedJourneys);
        
        // Calculate counts from loaded data
        const counts = {
          live: convertedJourneys.filter(j => j.status === 'live').length,
          draft: convertedJourneys.filter(j => j.status === 'draft').length,
          scheduled: convertedJourneys.filter(j => j.status === 'scheduled').length,
          total: convertedJourneys.length
        };
        
        // If showing all, update counts, otherwise keep existing counts
        if (localFilter === 'all') {
          setJourneyCounts(counts);
        }
      }
    } catch (error) {
      console.error('Failed to load journeys:', error);
      // Fallback to mock data on error
      setJourneys(mockJourneys);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const formatLastEdited = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const formatScheduledDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter journeys based on status and search query
  const filteredJourneys = useMemo(() => {
    let filtered = journeys;

    // Filter by status (if not showing all)
    if (localFilter !== 'all') {
      filtered = filtered.filter(journey => journey.status === localFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(journey => 
        journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journey.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [journeys, localFilter, searchQuery]);

  // Navigation handlers
  const handleEditDraft = (journeyId: string) => {
    console.log('🔧 Editing draft journey:', journeyId);
    console.log('📍 Navigating to:', `/dashboard/journeys/draft/${journeyId}/edit`);
    onClose(); // Close the modal first
    router.push(`/dashboard/journeys/draft/${journeyId}/edit`);
  };

  const handleEditSchedule = (journeyId: string) => {
    onClose(); // Close the modal first  
    // Since scheduled journeys might be edited differently, 
    // let's use the draft edit page for now or create a specific handler
    router.push(`/dashboard/journeys/draft/${journeyId}/edit`);
  };

  const handlePublishNow = async (journeyId: string) => {
    // TODO: Implement publish now functionality
    console.log('Publishing journey:', journeyId);
    // You might want to call an API to publish the journey immediately
  };

  const handlePublishDraft = async (journeyId: string, journey: DatabaseJourney) => {
    // Check if journey is ready to publish (progress >= 70%)
    if ((journey.progress || 0) < 70) {
      alert('Please complete your journey (at least 70%) before publishing.');
      return;
    }
    
    // TODO: Implement publish draft functionality
    console.log('Publishing draft journey:', journeyId);
    // You might want to call an API to publish the draft
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  My Journey
                  {filterStatus && (
                    <span className="ml-2 text-lg font-medium text-blue-600">
                      - {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filterStatus 
                    ? `Manage your ${filterStatus} journeys` 
                    : 'Manage all your journey drafts, scheduled posts, and live content'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search journeys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={localFilter}
                onChange={(e) => setLocalFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Journeys ({journeyCounts.total})</option>
                <option value="draft">Draft ({journeyCounts.draft})</option>
                <option value="scheduled">Scheduled ({journeyCounts.scheduled})</option>
                <option value="live">Live ({journeyCounts.live})</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{journeyCounts.draft}</p>
                  <p className="text-sm text-blue-600">Draft Journeys</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">{journeyCounts.scheduled}</p>
                  <p className="text-sm text-orange-600">Scheduled</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Radio className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{journeyCounts.live}</p>
                  <p className="text-sm text-green-600">Live Journey</p>
                </div>
              </div>
            </div>
          </div>
          {/* Filtered Journeys */}
          <div className="space-y-4">
            {filteredJourneys.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No journeys found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No journeys match "${searchQuery}"` 
                    : `No ${localFilter === 'all' ? '' : localFilter} journeys yet`
                  }
                </p>
              </div>
            ) : (
              filteredJourneys.map((journey) => (
                <div key={journey.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{journey.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${
                          journey.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                          journey.status === 'scheduled' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {journey.status === 'draft' && <FileText className="w-3 h-3 mr-1" />}
                          {journey.status === 'scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                          {journey.status === 'live' && <Radio className="w-3 h-3 mr-1" />}
                          {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{journey.description}</p>
                      
                      {/* Status-specific info */}
                      {journey.status === 'draft' && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Last edited: {journey.lastEdited}</span>
                          <span>Progress: {journey.progress}%</span>
                        </div>
                      )}
                      
                      {journey.status === 'scheduled' && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Scheduled: {journey.scheduledDate}</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">Publishing Soon</span>
                        </div>
                      )}
                      
                      {journey.status === 'live' && journey.stats && (
                        <div className="grid grid-cols-4 gap-4 mt-2">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{journey.stats.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{journey.stats.likes.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Likes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{journey.stats.comments.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Comments</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{journey.stats.shares.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Shares</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex space-x-2 ml-4">
                      {journey.status === 'draft' && (
                        <>
                          <button 
                            onClick={() => handleEditDraft(journey.id)} 
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handlePublishDraft(journey.id, journey)} 
                            className={`px-3 py-1 rounded text-sm ${
                              (journey.progress || 0) >= 70 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}>
                            Publish
                          </button>
                        </>
                      )}
                      
                      {journey.status === 'scheduled' && (
                        <>
                          <button 
                            onClick={() => handleEditSchedule(journey.id)} 
                            className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded text-sm"
                          >
                            Edit Schedule
                          </button>
                          <button 
                            onClick={() => handlePublishNow(journey.id)} 
                            className="px-3 py-1 bg-orange-600 text-white hover:bg-orange-700 rounded text-sm"
                          >
                            Publish Now
                          </button>
                        </>
                      )}
                      
                      {journey.status === 'live' && (
                        <>
                          <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm">Analytics</button>
                          <button className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 rounded text-sm">View Journey</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create New Journey
            </button>
            <button 
              onClick={() => setLocalFilter('all')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View All Journeys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
