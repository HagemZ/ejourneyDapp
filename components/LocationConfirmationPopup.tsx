"use client";

import React, { useState, useEffect } from "react";
import { MapPin, X, Navigation, Loader2 } from "lucide-react";
import { getReverseGeocode } from "@/utils/geocoding";
import { LocationSuggestion } from "@/types";

interface LocationConfirmationPopupProps {
  isOpen: boolean;
  coordinates: [number, number];
  onConfirm: (locationData: LocationSuggestion) => void;
  onCancel: () => void;
}

export default function LocationConfirmationPopup({
  isOpen,
  coordinates,
  onConfirm,
  onCancel,
}: LocationConfirmationPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setLocationData(null);
      setError(null);
    }
  }, [isOpen]);

  // Fetch location data when popup opens
  useEffect(() => {
    if (isOpen && coordinates) {
      setIsLoading(true);
      setError(null);
      setLocationData(null);

      const fetchLocationData = async () => {
        try {
          const geocodeResult = await getReverseGeocode(coordinates[1], coordinates[0]);
          
          const enhancedLocation: LocationSuggestion = {
            name: geocodeResult.locationName || `Location (${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)})`,
            coordinates: coordinates,
            country: geocodeResult.country || "Unknown",
            city: geocodeResult.city || "Unknown"
          };

          setLocationData(enhancedLocation);
        } catch (error) {
          console.error('Failed to reverse geocode:', error);
          setError('Failed to get location details');
          
          // Fallback location data
          const fallbackLocation: LocationSuggestion = {
            name: `Location (${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)})`,
            coordinates: coordinates,
            country: "Unknown",
            city: "Unknown"
          };
          
          setLocationData(fallbackLocation);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocationData();
    }
  }, [isOpen, coordinates]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (locationData) {
      onConfirm(locationData);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-heading font-semibold text-gray-900">
            Log This Location?
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Coordinates Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Selected Location</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Lat: {coordinates[1].toFixed(6)}</div>
              <div>Lng: {coordinates[0].toFixed(6)}</div>
            </div>
          </div>

          {/* Location Details */}
          {isLoading ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                <span className="text-gray-700">Getting location details...</span>
              </div>
            </div>
          ) : locationData ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Location Details</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Name: </span>
                  <span className="text-gray-900">{locationData.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">City: </span>
                  <span className="text-gray-600">{locationData.city}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Country: </span>
                  <span className="text-gray-600">{locationData.country}</span>
                </div>
              </div>
              {error && (
                <div className="mt-2 text-xs text-yellow-600">
                  Note: Using fallback location data
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-red-700">
                Failed to get location details. Please try again.
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Would you like to create a journey entry for this location? You'll be able to add photos, 
              descriptions, and share your experience.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !locationData}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </span>
            ) : (
              'Create Journey'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
