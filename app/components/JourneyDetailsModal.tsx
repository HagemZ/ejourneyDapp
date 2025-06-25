"use client";

import React from "react";
import {
  X,
  MapPin,
  Star,
  Calendar,
  User,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Journey, User as UserType } from "../types";
import { format } from "date-fns";
import {
  summarizeLocationReviews,
  generateInsights,
} from "../utils/aiSummarizer";

interface JourneyDetailsModalProps {
  journey: Journey | null;
  author: UserType | null;
  allJourneys: Journey[];
  isOpen: boolean;
  onClose: () => void;
}

export default function JourneyDetailsModal({
  journey,
  author,
  allJourneys,
  isOpen,
  onClose,
}: JourneyDetailsModalProps) {
  if (!isOpen || !journey || !author) return null;

  // Get all journeys for the same location for AI insights
  const locationJourneys = allJourneys.filter(
    (j) => j.location.name === journey.location.name
  );

  const aiSummary = summarizeLocationReviews(locationJourneys);
  const insights = generateInsights(locationJourneys);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="relative">
          {journey.images.length > 0 && (
            <div className="h-64 w-full overflow-hidden rounded-t-2xl">
              <img
                src={journey.images[0]}
                alt={journey.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {journey.verifiedLocation && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Location Verified</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-heading font-bold text-gray-900 pr-4">
              {journey.title}
            </h1>
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-body font-bold text-gray-900">
                {journey.rating}/5
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-primary-400" />
            <span className="font-body text-lg text-gray-700">
              {journey.location.name}
            </span>
          </div>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-body font-semibold text-gray-900">
                  {author.name}
                </h3>
                <p className="text-sm text-gray-600">Travel Explorer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-body">
                {format(journey.createdAt, "MMMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-3">
              Journey Story
            </h2>
            <p className="font-body text-gray-700 leading-relaxed whitespace-pre-wrap">
              {journey.description}
            </p>
          </div>

          {/* Tags */}
          {journey.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {journey.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-600 font-body rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Images */}
          {journey.images.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-3">
                Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {journey.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={image}
                      alt={`${journey.title} - Photo ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 rounded-xl">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>🤖</span>
              <span>AI Location Insights</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-body font-semibold text-gray-800 mb-2">
                  Summary
                </h3>
                <p className="font-body text-gray-700 text-sm leading-relaxed">
                  {aiSummary}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body font-medium text-gray-700">
                    Average Rating
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-body font-bold">
                      {insights.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-body font-medium text-gray-700">
                    Total Reviews
                  </span>
                  <span className="font-body font-bold">
                    {insights.totalReviews}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-body font-medium text-gray-700">
                    Best Time to Visit
                  </span>
                  <span className="font-body font-bold">
                    {insights.bestTime}
                  </span>
                </div>

                <div>
                  <span className="font-body font-medium text-gray-700 block mb-2">
                    Popular Themes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {insights.topTags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent-200 text-gray-700 font-body rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
