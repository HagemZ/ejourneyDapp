"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, MapPin, Star, Camera, Navigation } from "lucide-react";
import { Journey, LocationSuggestion } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useGeolocation } from "../hooks/useGeolocation";

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJourneyCreate: (
    journey: Omit<Journey, "id" | "userId" | "createdAt">
  ) => void;
  selectedLocation?: LocationSuggestion;
}

interface JourneyForm {
  title: string;
  description: string;
  rating: number;
  tags: string;
  images: string;
}

export default function JourneyModal({
  isOpen,
  onClose,
  onJourneyCreate,
  selectedLocation,
}: JourneyModalProps) {
  const { user } = useAuth();
  const { coordinates, loading, error, getCurrentLocation } = useGeolocation();
  const [locationVerified, setLocationVerified] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JourneyForm>({
    defaultValues: {
      rating: 5,
    },
  });

  const onSubmit = (data: JourneyForm) => {
    if (!user || !selectedLocation) return;

    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const images = data.images
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean);

    const journey: Omit<Journey, "id" | "userId" | "createdAt"> = {
      title: data.title,
      description: data.description,
      location: selectedLocation,
      rating: data.rating,
      tags,
      images,
      verifiedLocation: locationVerified,
    };

    onJourneyCreate(journey);
    reset();
    onClose();
    setLocationVerified(false);
  };

  const handleLocationVerification = () => {
    getCurrentLocation();
  };

  React.useEffect(() => {
    if (coordinates && selectedLocation) {
      // Calculate distance between current location and selected location
      const distance = calculateDistance(
        coordinates[1],
        coordinates[0],
        selectedLocation.coordinates[1],
        selectedLocation.coordinates[0]
      );

      // If within 1km, consider location verified
      if (distance < 1) {
        setLocationVerified(true);
      }
    }
  }, [coordinates, selectedLocation]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Location Display */}
          {selectedLocation && (
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="font-body font-medium text-gray-900">
                  {selectedLocation.name}
                </span>
              </div>

              {/* Location Verification */}
              <div className="mt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleLocationVerification}
                  disabled={loading}
                  className="flex items-center space-x-2 text-sm text-primary-400 hover:text-primary-500"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{loading ? "Verifying..." : "Verify Location"}</span>
                </button>
                {locationVerified && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Location Verified
                  </span>
                )}
                {error && <span className="text-sm text-red-500">{error}</span>}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Journey Title *
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              placeholder="Amazing Tokyo Adventure"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
              placeholder="Tell us about your experience..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    value={star}
                    {...register("rating")}
                    className="sr-only"
                  />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              placeholder="culture, food, adventure"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Images (comma-separated URLs)
            </label>
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register("images")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use high-quality image URLs from Pexels, Unsplash, or similar
              services
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-body font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-300 hover:bg-primary-400 text-white rounded-lg font-body font-medium transition-colors duration-200"
            >
              Share Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
