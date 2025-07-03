"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, MapPin, Star, Camera, Navigation } from "lucide-react";
import { Journey, LocationSuggestion } from "../types";
// import { useAuth } from "@/hooks/useAuth";
import useGetUserData from "@/hooks/useAddress";
import { useGeolocation } from "@/hooks/useGeolocation";
import { createJourney, uploadImages, checkJourneyProximity } from "../actions/journeyActions";
import { getReverseGeocode } from "../utils/geocoding";
import { generateAILocationSummary } from "../utils/aiSummarizer";
import ShareOptionsModal from "./ShareOptionsModal";
import { toast } from "sonner";

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJourneyCreate: (
    journey: Omit<Journey, "id" | "userId" | "createdAt">
  ) => void;
  selectedLocation?: LocationSuggestion;
  verificationLocation?: [number, number] | null;
  onViewJourney?: (journey: Journey) => void;
}

export default function JourneyModal({
  isOpen,
  onClose,
  onJourneyCreate,
  selectedLocation,
  verificationLocation,
  onViewJourney,
}: JourneyModalProps) {
  // Debug logging
  console.log('JourneyModal props:', {
    isOpen,
    selectedLocation,
    verificationLocation
  });

  // const { user } = useAuth();
  const { users } = useGetUserData();
  const { coordinates, loading, error, getCurrentLocation } = useGeolocation();
  
  // If we have verificationLocation and no selectedLocation, auto-verify the location
  const [locationVerified, setLocationVerified] = useState(
    !selectedLocation && !!verificationLocation
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingJourneyData, setPendingJourneyData] = useState<any>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Proximity check states
  const [showProximityWarning, setShowProximityWarning] = useState(false);
  const [nearbyJourneys, setNearbyJourneys] = useState<any[]>([]);
  const [checkingProximity, setCheckingProximity] = useState(false);
  
  // Location name loading state
  const [loadingLocationName, setLoadingLocationName] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      rating: 5,
      tags: "",
      images: [],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      images: Yup.array()
        .of(
          Yup.mixed()
            .test(
              "fileType",
              "Only image files are allowed",
              (file) => {
                if (!file) return true; // Allow empty files
                return Boolean((file as File).type && (file as File).type.startsWith("image/"));
              }
            )
            .test(
              "fileSize",
              "Each image must be less than 5MB",
              (file) => {
                if (!file) return true; // Allow empty files
                return (file as File).size <= 5 * 1024 * 1024; // 5MB limit per file
              }
            )
        )
        .max(3, "You can upload up to 3 images")
        .test(
          "totalSize",
          "Total images size must be less than 10MB",
          (files) => {
            if (!files || files.length === 0) return true;
            const totalSize = (files as File[]).reduce((sum: number, file: File) => {
              return sum + (file?.size || 0);
            }, 0);
            return totalSize <= 10 * 1024 * 1024; // 10MB total limit
          }
        ),
    }),
    onSubmit: async (data) => {
      console.log('Form submitted with data:', data);
      console.log('Users:', users);
      console.log('Selected location:', selectedLocation);
      console.log('Current coordinates:', coordinates);
      
      if (!users) {
        console.error('Missing user data');
        toast.error('User data is required');
        return;
      }

      // Use current location if no location is selected
      let locationToUse = selectedLocation;
      if (!selectedLocation && (verificationLocation || coordinates)) {
        const locationCoords = verificationLocation || coordinates;
        if (locationCoords) {
          setLoadingLocationName(true);
          try {
            // Try to get a meaningful location name using reverse geocoding
            const geocodeResult = await getReverseGeocode(locationCoords[1], locationCoords[0]);
            
            locationToUse = {
              name: geocodeResult.locationName || `Location (${locationCoords[1].toFixed(4)}, ${locationCoords[0].toFixed(4)})`,
              coordinates: locationCoords,
              country: geocodeResult.country || "Unknown",
              city: geocodeResult.city || "Unknown"
            };
            console.log('Resolved location name:', geocodeResult);
          } catch (error) {
            console.error('Failed to reverse geocode:', error);
            // Fallback to a more user-friendly name
            locationToUse = {
              name: `My Location`,
              coordinates: locationCoords,
              country: "Unknown",
              city: "Unknown"
            };
          } finally {
            setLoadingLocationName(false);
          }
          console.log('Using location:', locationToUse);
        }
      }

      if (!locationToUse) {
        toast.error('Please enable location access or select a location on the map');
        return;
      }

      // Check for nearby journeys first
      setCheckingProximity(true);
      try {
        const proximityResult = await checkJourneyProximity({
          latitude: locationToUse.coordinates[1],
          longitude: locationToUse.coordinates[0],
          radiusMeters: 20 // Changed to 20 meters
        });

        if (proximityResult.success && proximityResult.hasNearbyJourneys) {
          // Show proximity warning - no new journey allowed within 20m
          setNearbyJourneys(proximityResult.nearbyJourneys);
          setShowProximityWarning(true);
          setPendingJourneyData({ ...data, locationToUse });
          setCheckingProximity(false);
          return;
        }
      } catch (error) {
        console.error('Error checking proximity:', error);
        // Continue with journey creation if proximity check fails
      }
      setCheckingProximity(false);

      // Store form data and location to use
      console.log('Opening share modal...');
      setPendingJourneyData({ ...data, locationToUse });
      setIsShareModalOpen(true);
    },
  });

  const handleLocationVerification = () => {
    getCurrentLocation();
  };

  const handleShare = async (shareType: 'live' | 'draft' | 'scheduled', scheduledAt?: Date) => {
    if (!pendingJourneyData || !users) return;
    
    // Get the location to use from pending data or use selectedLocation
    const locationToUse = pendingJourneyData.locationToUse || selectedLocation;
    
    if (!locationToUse) {
      toast.error('Location data is missing');
      setSubmitting(false);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // First upload images if any exist
      let imageUrls: string[] = [];
      if (pendingJourneyData.images && pendingJourneyData.images.length > 0) {
        const imageUploadResult = await uploadImages(pendingJourneyData.images);
        
        if (!imageUploadResult.success) {
          toast.error(imageUploadResult.error || 'Failed to upload images');
          setSubmitting(false);
          return;
        }
        
        imageUrls = imageUploadResult.urls || [];
      }

      const tags = pendingJourneyData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);

      // Create journey with uploaded image URLs
      const journeyData = {
        userId: users.id, // Add user ID
        title: pendingJourneyData.title,
        description: pendingJourneyData.description,
        rating: pendingJourneyData.rating,
        tags,
        images: imageUrls,
        location: {
          name: locationToUse.name,
          coordinates: locationToUse.coordinates,
        },
        verifiedLocation: !selectedLocation && (coordinates || verificationLocation) ? true : locationVerified, // Auto-verify GPS locations
        verificationLocation: !selectedLocation && (coordinates || verificationLocation) 
          ? (verificationLocation || coordinates || undefined) 
          : (verificationLocation || undefined),
        shareType,
        scheduledAt: scheduledAt?.toISOString(),
      };

      const result = await createJourney(journeyData);

      if (result.success) {
        toast.success(
          shareType === 'live' ? 'Journey shared successfully!' :
          shareType === 'draft' ? 'Journey saved as draft!' :
          'Journey scheduled successfully!'
        );
        
        // Call the original onJourneyCreate if it was a live share
        if (shareType === 'live' && result.journey) {
          onJourneyCreate(result.journey);
        }
        
        // Close modals and reset form
        setIsShareModalOpen(false);
        formik.resetForm();
        onClose();
        setLocationVerified(false);
        setPendingJourneyData(null);
      } else {
        toast.error(result.error || 'Failed to create journey');
      }
    } catch (error) {
      console.error('Error sharing journey:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate AI suggestion for location
  const generateAISuggestion = async (locationName: string, description: string) => {
    setLoadingAI(true);
    try {
      const result = await generateAILocationSummary(locationName, description);
      if (result.success && result.summary) {
        setAiSuggestion(result.summary);
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  // Generate AI suggestion when description changes and location is available
  React.useEffect(() => {
    const locationName = selectedLocation?.name || 
                        (verificationLocation ? 'Current Location' : null);
    
    if (locationName && formik.values.description.length > 20) {
      const timeoutId = setTimeout(() => {
        generateAISuggestion(locationName, formik.values.description);
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [formik.values.description, selectedLocation, verificationLocation]);

  React.useEffect(() => {
    // Auto-verify location when using GPS coordinates without a selected location
    if (!selectedLocation && (verificationLocation || coordinates)) {
      setLocationVerified(true);
    } else if (selectedLocation) {
      setLocationVerified(false); // Reset for selected locations
    }
  }, [selectedLocation, verificationLocation, coordinates]);

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

  if (!isOpen || !users) return null;

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
        <form 
          onSubmit={(e) => {
            console.log('Form onSubmit triggered');
            e.preventDefault();
            formik.handleSubmit(e);
          }} 
          className="p-6 space-y-6"
        >
          {/* Location Display */}
          {selectedLocation ? (
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="font-body font-medium text-gray-900">
                  {selectedLocation.name}
                </span>
              </div>

              {/* Location Verification - only show for selected locations, not GPS */}
              <div className="mt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleLocationVerification}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 space-x-2 text-sm text-primary-400 hover:text-primary-500"
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
          ) : (verificationLocation || coordinates) ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="font-body font-medium text-green-800">
                  Using Current GPS Location
                </span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Your current GPS location will be used: {verificationLocation ? 
                  `${verificationLocation[1].toFixed(4)}, ${verificationLocation[0].toFixed(4)}` : 
                  coordinates ? `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}` : ''
                }
              </p>
              <span className="text-sm text-green-600 font-medium mt-2 inline-block">
                ✓ GPS Location Auto-Verified
              </span>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <span className="font-body font-medium text-yellow-800">
                  Getting Location...
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Please allow location access or select a location on the map.
              </p>
            </div>
          )}

          {/* Verification Location (GPS) */}
          {verificationLocation && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              <strong>Verification GPS:</strong>
              <br />
              Lat: {verificationLocation[1].toFixed(6)}
              <br />
              Lng: {verificationLocation[0].toFixed(6)}
            </div>
          )}

          {/* Current Location */}
          {coordinates && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
              <strong>Current Location:</strong>
              <br />
              Lat: {coordinates[1].toFixed(6)}
              <br />
              Lng: {coordinates[0].toFixed(6)}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Journey Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              placeholder="Amazing Tokyo Adventure"
              aria-invalid={!!(formik.touched.title && formik.errors.title)}
              aria-describedby="title-error"
            />
            {formik.touched.title && formik.errors.title && (
              <p id="title-error" className="text-red-500 text-sm mt-1">
                {formik.errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
              placeholder="Tell us about your experience..."
              aria-invalid={!!(formik.touched.description && formik.errors.description)}
              aria-describedby="description-error"
            />
            {formik.touched.description && formik.errors.description && (
              <p id="description-error" className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* AI Suggestion */}
          {(loadingAI || aiSuggestion) && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg text-blue-800 text-sm">
              <div className="flex items-center space-x-2">
                <strong>🤖 AI Suggestion:</strong>
                {loadingAI && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
              {loadingAI ? (
                <div className="mt-2 space-y-2">
                  <div className="h-3 bg-blue-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-blue-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <p className="mt-2">{aiSuggestion}</p>
              )}
            </div>
          )}

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
                    name="rating"
                    value={star}
                    checked={formik.values.rating === star}
                    onChange={() => formik.setFieldValue('rating', star)}
                    className="sr-only"
                  />
                  <Star 
                    className={`w-6 h-6 ${
                      formik.values.rating >= star 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
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
              {...formik.getFieldProps("tags")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              placeholder="culture, food, adventure"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-body font-medium text-gray-700 mb-2">
              Images (up to 3, min 800x600px) - Optional
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []).slice(0, 3);
                
                // Show loading state
                const loadingToast = toast.loading('Compressing images...');
                
                try {
                  // Compress images before adding to form
                  const compressedFiles = await Promise.all(
                    files.map(file => compressImage(file, 2)) // Compress to max 2MB each
                  );
                  
                  formik.setFieldValue('images', compressedFiles);
                  toast.dismiss(loadingToast);
                  toast.success(`${compressedFiles.length} image(s) compressed and ready`);
                } catch (error) {
                  console.error('Error compressing images:', error);
                  toast.dismiss(loadingToast);
                  toast.error('Failed to compress images');
                  formik.setFieldValue('images', files); // fallback to original files
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formik.values.images && formik.values.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formik.values.images.map((file: File, idx: number) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                ))}
              </div>
            )}
            {formik.touched.images && formik.errors.images && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(formik.errors.images) ? formik.errors.images[0] : formik.errors.images}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload up to 3 images. Each will be compressed to optimize file size. Images are optional.
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
              disabled={formik.isSubmitting || checkingProximity || loadingLocationName || (!selectedLocation && !verificationLocation && !coordinates)}
              className="flex-1 px-4 py-2 bg-blue-300 hover:bg-blue-600 text-white rounded-lg font-body font-medium transition-colors duration-200 disabled:opacity-50"
              onClick={(e) => {
                console.log('Submit button clicked');
                console.log('Form errors:', formik.errors);
                console.log('Form values:', formik.values);
                console.log('Form is valid:', formik.isValid);
                console.log('Selected location:', selectedLocation);
                console.log('Verification location:', verificationLocation);
                console.log('Current coordinates:', coordinates);
              }}
            >
              {loadingLocationName ? 'Getting location...' : checkingProximity ? 'Checking location...' : formik.isSubmitting ? 'Processing...' : 'Share Journey'}
            </button>
          </div>
        </form>
      </div>

      {/* Proximity Warning Modal */}
      {showProximityWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Location Already Exists
              </h3>
              <button
                onClick={() => {
                  setShowProximityWarning(false);
                  setNearbyJourneys([]);
                  setPendingJourneyData(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                There {nearbyJourneys.length === 1 ? 'is already a journey' : 'are already journeys'} within 20 meters of this location. Each location can only have one unique journey.
              </p>
              <p className="text-sm text-blue-600 mb-3">
                You can vote or add a review to the existing journey instead of creating a new one.
              </p>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {nearbyJourneys.map((nearby, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <h4 className="font-medium text-gray-900">{nearby.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      By {nearby.authorName || 'Anonymous'} • {nearby.distance}m away
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {nearby.description}
                    </p>
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < nearby.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{nearby.rating}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowProximityWarning(false);
                  setNearbyJourneys([]);
                  setPendingJourneyData(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Navigate to the existing journey for review/voting
                  const nearestJourney = nearbyJourneys[0];
                  setShowProximityWarning(false);
                  onClose(); // Close the modal
                  
                  // Open the journey details modal for reviewing
                  if (onViewJourney && nearestJourney) {
                    onViewJourney(nearestJourney);
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View & Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Options Modal */}
      <ShareOptionsModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setPendingJourneyData(null);
        }}
        onShare={handleShare}
        loading={submitting}
      />
    </div>
  );
}

// Helper function to compress images
async function compressImage(file: File, maxSizeMB: number = 2): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // fallback to original file
          }
        },
        file.type,
        0.8 // Quality (0.8 = 80% quality)
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
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
