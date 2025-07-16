"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Star,
  Camera,
  Clock,
  Eye,
  Radio,
  Shield,
  User,
  Home,
  Map,
  PlusCircle
} from "lucide-react";
import { Journey } from "../../../types";
import ConnectButtonCustom from "@/components/ConnectButtonCustom";

export default function JourneyViewPage() {
  const router = useRouter();
  const params = useParams();
  const { address, isConnected } = useAccount();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJourney();
  }, [journeyId]);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journeys/${journeyId}`);
      
      if (response.ok) {
        const data = await response.json();
        const journeyData = data.journey;
        
        // Format the journey data
        const formattedJourney: Journey = {
          id: journeyData.id,
          userId: journeyData.userId,
          title: journeyData.title,
          description: journeyData.description,
          location: {
            name: journeyData.location?.name || journeyData.locationName || '',
            coordinates: [
              journeyData.location?.coordinates?.[0] || parseFloat(journeyData.locationLng || '0'),
              journeyData.location?.coordinates?.[1] || parseFloat(journeyData.locationLat || '0')
            ] as [number, number],
            country: journeyData.location?.country || journeyData.locationName?.split(',').pop()?.trim() || '',
            city: journeyData.location?.city || journeyData.locationName?.split(',')[0]?.trim() || ''
          },
          images: Array.isArray(journeyData.images) 
            ? journeyData.images.flat().filter((img: any) => img && typeof img === 'string') 
            : (journeyData.images && typeof journeyData.images === 'string' ? [journeyData.images] : []),
          rating: Number(journeyData.rating),
          tags: Array.isArray(journeyData.tags) 
            ? journeyData.tags.flat().filter((tag: any) => tag && typeof tag === 'string') 
            : (journeyData.tags && typeof journeyData.tags === 'string' ? [journeyData.tags] : []),
          createdAt: new Date(journeyData.createdAt),
          verifiedLocation: Boolean(journeyData.verifiedLocation),
          totalVotes: Number(journeyData.totalVotes || 0),
          voteScore: Number(journeyData.voteScore || 0),
          averageRating: Number(journeyData.averageRating || 0),
          reviewCount: Number(journeyData.reviewCount || 0),
          shareType: journeyData.shareType,
          scheduledAt: journeyData.scheduledAt ? new Date(journeyData.scheduledAt) : null,
          status: journeyData.status,
          authorName: journeyData.authorName,
          authorEmail: journeyData.authorEmail
        };
        
        setJourney(formattedJourney);
      } else {
        setError('Journey not found');
      }
    } catch (error) {
      console.error("Error fetching journey:", error);
      setError('Failed to load journey');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: journey?.title || 'Amazing Journey',
        text: journey?.description || 'Check out this amazing travel journey!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        alert('Unable to copy link');
      });
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
                  Journey View
                </h1>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Home</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                </button>

                {/* Wallet Connect Button */}
                <ConnectButtonCustom />
              </div>
            </div>
          </div>
        </header>

        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading journey...</div>
        </div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
                  Journey Not Found
                </h1>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Home</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                </button>

                {/* Wallet Connect Button */}
                <ConnectButtonCustom />
              </div>
            </div>
          </div>
        </header>

        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">{error || 'Journey not found'}</div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
                Journey Explorer
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Home</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
              </button> */}

              {/* Wallet Connect Button - Optional for public viewing */}
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          {/* <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div> */}

          {/* Journey Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${
                    journey.shareType === 'live' 
                      ? 'bg-green-100 text-green-800' 
                      : journey.shareType === 'scheduled'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {journey.shareType === 'live' && <Radio className="w-3 h-3 mr-1" />}
                    {journey.shareType === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                    {journey.shareType === 'draft' && <Eye className="w-3 h-3 mr-1" />}
                    {journey.shareType === 'live' ? 'Live' : journey.shareType === 'scheduled' ? 'Scheduled' : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Published {getTimeAgo(journey.createdAt)}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-3">
                  {journey.title || 'Untitled Journey'}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-base">{journey.location.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-base">{journey.createdAt.toLocaleDateString()}</span>
                  </div>
                  {journey.authorName && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      <span className="text-base">By {journey.authorName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-1" />
                    <span>{journey.totalVotes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-1" />
                    <span>{journey.reviewCount}</span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              {journey.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-1 gap-4 p-6">
                    {journey.images
                      .filter((image): image is string => typeof image === 'string' && image.length > 0)
                      .map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`}
                          alt={`Journey image ${index + 1}`}
                          className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Journey</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {journey.description || 'No description available for this journey.'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {journey.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {journey.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < journey.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{journey.rating}/5</span>
                </div>
                {journey.averageRating > 0 && (
                  <p className="text-sm text-gray-600">
                    Average rating: {journey.averageRating.toFixed(1)}/5 from {journey.reviewCount} review{journey.reviewCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{journey.location.name}</p>
                      <p className="text-sm text-gray-600">{journey.location.city}, {journey.location.country}</p>
                    </div>
                  </div>
                  {journey.verifiedLocation && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Verified Location</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Likes</span>
                    <span className="font-semibold text-gray-900">{journey.totalVotes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold text-gray-900">{journey.reviewCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Photos</span>
                    <span className="font-semibold text-gray-900">{journey.images.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold text-gray-900">{journey.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              {!isConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <PlusCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Create Your Own Journey</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Share your travel experiences with the world
                  </p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
