"use client";

import React, { useState } from "react";
import { X, Calendar, Send, FileText, Clock } from "lucide-react";
import { toast } from "sonner";

interface ShareOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (shareType: 'live' | 'draft' | 'scheduled', scheduledAt?: Date) => void;
  loading?: boolean;
}

export default function ShareOptionsModal({
  isOpen,
  onClose,
  onShare,
  loading = false,
}: ShareOptionsModalProps) {
  const [selectedOption, setSelectedOption] = useState<'live' | 'draft' | 'scheduled'>('live');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleShare = () => {
    if (selectedOption === 'scheduled') {
      if (!scheduledDate || !scheduledTime) {
        toast.error('Please select a date and time for scheduled post');
        return;
      }
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledAt <= new Date()) {
        toast.error('Scheduled time must be in the future');
        return;
      }
      onShare(selectedOption, scheduledAt);
    } else {
      onShare(selectedOption);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-gray-900">
            Share Your Journey
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose how you'd like to share your journey:
          </p>

          {/* Live Share Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedOption === 'live' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('live')}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedOption === 'live' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Send className={`w-5 h-5 ${
                  selectedOption === 'live' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Live Share</h3>
                <p className="text-sm text-gray-600">
                  Share immediately and make it visible to everyone
                </p>
              </div>
            </div>
          </div>

          {/* Draft Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedOption === 'draft' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('draft')}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedOption === 'draft' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-5 h-5 ${
                  selectedOption === 'draft' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Save as Draft</h3>
                <p className="text-sm text-gray-600">
                  Save privately and share later
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Post Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedOption === 'scheduled' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedOption('scheduled')}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedOption === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Clock className={`w-5 h-5 ${
                  selectedOption === 'scheduled' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Schedule Post</h3>
                <p className="text-sm text-gray-600">
                  Choose when to automatically share
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Date/Time Inputs */}
          {selectedOption === 'scheduled' && (
            <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sharing...</span>
                </>
              ) : (
                <span>
                  {selectedOption === 'live' ? 'Share Now' : 
                   selectedOption === 'draft' ? 'Save Draft' : 
                   'Schedule Post'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
