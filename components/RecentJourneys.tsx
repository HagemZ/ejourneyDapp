"use client";

import React, { useState, useMemo } from "react";
import { X, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Journey } from "@/types";
import { mockUsers } from "@/utils/mockData";
import JourneyCard from "@/components/JourneyCard";

interface RecentJourneysProps {
  isOpen: boolean;
  onClose: () => void;
  journeys: Journey[];
  onJourneyClick: (journey: Journey) => void;
  onZoomToLocation?: (journey: Journey) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function RecentJourneys({ 
  isOpen, 
  onClose, 
  journeys, 
  onJourneyClick,
  onZoomToLocation 
}: RecentJourneysProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get recent journeys (sorted by creation date)
  const allRecentJourneys = useMemo(() => {
    return journeys
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [journeys]);

  // Pagination calculations
  const totalPages = Math.ceil(allRecentJourneys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJourneys = allRecentJourneys.slice(startIndex, endIndex);

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getAuthor = (journey: Journey) => {
    // Use real author data from the journey if available
    if (journey.authorName || journey.authorEmail) {
      return {
        id: journey.userId,
        name: journey.authorName || 'Anonymous User',
        email: journey.authorEmail || 'user@example.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${journey.userId}`,
        verified: true,
        bio: "",
        joinedAt: new Date().toISOString(),
        socialLinks: {
          twitter: "",
          instagram: "",
          website: ""
        }
      };
    }
    
    // Fallback to mock user if no author data available
    return mockUsers.find((user) => user.id === journey.userId) || mockUsers[0];
  };

  // Move conditional return after all hooks to avoid hook order violations
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex" style={{top: '64px'}}>
      {/* Mobile Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="bg-white w-full md:w-96 h-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header - Fixed position to avoid being covered */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-heading font-bold text-gray-900">Recent Journeys</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            Latest journeys from the community
          </p>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    itemsPerPage === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {startIndex + 1}-{Math.min(endIndex, allRecentJourneys.length)} of {allRecentJourneys.length}
            </span>
          </div>
          
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4">
          {paginatedJourneys.length > 0 ? (
            <div className="space-y-4">
              {paginatedJourneys.map((journey: Journey) => {
                const author = getAuthor(journey);
                return (
                  <div key={journey.id} className="transform scale-95 hover:scale-100 transition-transform duration-200">
                    <JourneyCard
                      journey={journey}
                      author={author}
                      onClick={() => {
                        onJourneyClick(journey);
                        onClose(); // Close the sidebar after selecting a journey
                      }}
                      onZoomToLocation={onZoomToLocation ? () => onZoomToLocation(journey) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MapPin className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No Recent Journeys</p>
              <p className="text-sm text-center mt-2">
                Start exploring to see recent journeys from the community
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Showing {paginatedJourneys.length} of {allRecentJourneys.length} journeys
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-gray-400 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right side overlay for desktop */}
      <div 
        className="hidden md:block flex-1 bg-transparent"
        onClick={onClose}
      />
    </div>
  );
}
