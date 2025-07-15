"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowLeft, Save, Calendar, Eye, MapPin, Lock, Camera, Shield, User } from "lucide-react";
import { Journey } from "../../../../../../types";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";

export default function EditDraftPage() {
  const router = useRouter();
  const params = useParams();
  const { address, isConnected } = useAccount();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: 5,
    tags: [] as string[],
    scheduledAt: "",
    shareType: "draft" as "draft" | "scheduled" | "live"
  });

  // Debug effect to monitor formData changes
  // useEffect(() => {
  //   console.log('FormData state changed:', formData);
  // }, [formData]);

  // If wallet not connected, show connection prompt
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
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md">
                To edit your journey, please connect your wallet using the button above.
              </p>
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchJourney();
    }
  }, [journeyId, isConnected, address]);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      // console.log('Fetching journey:', journeyId); // Debug log
      const response = await fetch(`http://localhost:3033/api/journeys/${journeyId}`);
      if (response.ok) {
        const data = await response.json();
        const journeyData = data.journey;
        // console.log('Journey data received:', journeyData); // Debug log
        setJourney(journeyData);
        
        // Handle existing images - flatten nested arrays if needed
        let images = [];
        if (journeyData.images) {
          if (Array.isArray(journeyData.images)) {
            images = journeyData.images.flat().filter((img: any) => img && typeof img === 'string');
          } else if (typeof journeyData.images === 'string') {
            images = [journeyData.images];
          }
        }
        setExistingImages(images);
        
        // Handle tags - flatten nested arrays if needed
        let tags = [];
        if (journeyData.tags) {
          if (Array.isArray(journeyData.tags)) {
            tags = journeyData.tags.flat().filter((tag: any) => tag && typeof tag === 'string');
          }
        }
        
        const newFormData = {
          title: journeyData.title || "",
          description: journeyData.description || "",
          rating: journeyData.rating || 5,
          tags: tags,
          scheduledAt: journeyData.scheduledAt ? new Date(journeyData.scheduledAt).toISOString().slice(0, 16) : "",
          shareType: journeyData.shareType || "draft"
        };
        // console.log('Setting form data:', newFormData); // Debug log
        
        // Force a state update by using functional setState
        setFormData(prevData => {
          // console.log('Previous form data:', prevData);
          // console.log('New form data:', newFormData);
          return newFormData;
        });
      } else {
        // console.error('Failed to fetch journey, status:', response.status);
      }
    } catch (error) {
      console.error("Error fetching journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3); // Limit to 3 images
      
      try {
        // Compress images before setting them
        const compressedFiles = await Promise.all(
          fileArray.map(file => compressImage(file, 2)) // Compress to max 2MB each
        );
        
        setSelectedImages(compressedFiles);
        // You could add a toast notification here if needed
        console.log(`${compressedFiles.length} image(s) compressed and ready`);
      } catch (error) {
        console.error('Error compressing images:', error);
        // Fallback to original files if compression fails
        setSelectedImages(fileArray);
      }
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:3033/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.urls || [];
      }
      return [];
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload new images if any
      let newImagePaths: string[] = [];
      if (selectedImages.length > 0) {
        newImagePaths = await uploadImages(selectedImages);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImagePaths];

      const updateData = {
        ...formData,
        images: allImages,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null
      };

      const response = await fetch(`http://localhost:3033/api/journeys/${journeyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/dashboard/journeys/draft");
      }
    } catch (error) {
      console.error("Error updating journey:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishNow = async () => {
    setSaving(true);
    try {
      // Upload new images if any
      let newImagePaths: string[] = [];
      if (selectedImages.length > 0) {
        newImagePaths = await uploadImages(selectedImages);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImagePaths];

      const updateData = {
        ...formData,
        shareType: "live",
        scheduledAt: null,
        images: allImages
      };

      const response = await fetch(`http://localhost:3033/api/journeys/${journeyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/dashboard/journeys/live");
      }
    } catch (error) {
      console.error("Error publishing journey:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!formData.scheduledAt) {
      alert("Please select a scheduled time");
      return;
    }

    setSaving(true);
    try {
      // Upload new images if any
      let newImagePaths: string[] = [];
      if (selectedImages.length > 0) {
        newImagePaths = await uploadImages(selectedImages);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImagePaths];

      const updateData = {
        ...formData,
        shareType: "scheduled",
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        images: allImages
      };

      const response = await fetch(`http://localhost:3033/api/journeys/${journeyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/dashboard/journeys/scheduled");
      }
    } catch (error) {
      console.error("Error scheduling journey:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-lg text-red-600">Journey not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Protected Header - Same as main journeys page */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
                Edit Journey
              </h1>
            </div>

            {/* User Info and Wallet */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User ID Display - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  ID: {address?.slice(0, 8)}...
                </span>
              </div>
              
              {/* Wallet Protection Status */}
              <div className="flex items-center space-x-2 px-2 sm:px-3 py-2 bg-green-100 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-green-700">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">Back to Drafts</span>
                    <span className="sm:hidden">Back</span>
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">
                  Edit Draft Journey
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                  Modify your journey details before publishing
                </p>
              </div>
            </div>
            {loading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">Loading journey data...</p>
              </div>
            )}
            {/* Remove debug section */}
          </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journey Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                    placeholder="Enter your journey title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      // console.log('Description changed to:', e.target.value); // Debug log
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                    placeholder="Describe your journey experience"
                  />
                  {/* Remove debug text
                  <p className="text-xs text-gray-500 mt-1">
                    Current value: "{formData.description}"
                  </p>
                  */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`text-xl sm:text-2xl ${
                          star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Journey Images
              </h2>
              
              <div className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Images
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-3 sm:gap-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.startsWith('http') ? image : `http://localhost:3033${image}`}
                            alt={`Journey image ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Images (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:sm:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-3 sm:gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 sm:px-2 sm:py-1 rounded max-w-full truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Upload up to 3 images. Each file should be less than 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Location (Read-only) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Location</h2>
                <div className="flex items-center text-gray-500">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">Cannot be changed</span>
                </div>
              </div>
              
              <div className="flex items-start sm:items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm sm:text-base break-words">{journey.location.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">
                    {journey.location.city}, {journey.location.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Publishing Options</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule for Later (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Leave empty to keep as draft or publish immediately
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>

                <button
                  onClick={handlePublishNow}
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Now
                </button>

                <button
                  onClick={handleSchedule}
                  disabled={saving || !formData.scheduledAt}
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </button>
              </div>
            </div>

            {/* Journey Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Journey Info</h3>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-orange-600">Draft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">
                    {new Date(journey.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Images:</span>
                  <span className="font-medium">{journey.images.length}</span>
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
