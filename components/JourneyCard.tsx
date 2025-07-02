"use client";

import React from "react";
import { MapPin, Star, User, Calendar, Shield } from "lucide-react";
import { Journey, User as UserType } from "../types";
import { format } from "date-fns";

interface JourneyCardProps {
  journey: Journey;
  author: UserType;
  onClick: () => void;
}

export default function JourneyCard({
  journey,
  author,
  onClick,
}: JourneyCardProps) {
  // Debug: Log journey data
  console.log(`JourneyCard for "${journey.title}":`, {
    hasImages: journey.images.length > 0,
    imageCount: journey.images.length,
    images: journey.images
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image */}
      {journey.images.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={journey.images[0]}
            alt={journey.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => console.log(`Image loaded for journey "${journey.title}":`, journey.images[0])}
            onError={(e) => console.error(`Image failed to load for journey "${journey.title}":`, journey.images[0], e)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Verification Badge */}
          {journey.verifiedLocation && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
              <Shield className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-gray-900 line-clamp-2">
            {journey.title}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-body font-medium text-gray-700">
              {journey.rating}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-body text-gray-600">
            {journey.location.name}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 font-body text-sm line-clamp-3 mb-4">
          {journey.description}
        </p>

        {/* Tags */}
        {journey.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {journey.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-body rounded-full"
              >
                #{tag}
              </span>
            ))}
            {journey.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-body rounded-full">
                +{journey.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-300 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-sm font-body text-gray-600">
              {author.name}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-3 h-3" />
            <span className="text-xs font-body">
              {format(journey.createdAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
