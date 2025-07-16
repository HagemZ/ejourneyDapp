"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Eye, Star, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Journey, Review } from "../../../../../../types";

export default function LiveJourneyViewPage() {
  const router = useRouter();
  const params = useParams();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "analytics">("overview");

  useEffect(() => {
    fetchJourney();
    fetchReviews();
  }, [journeyId]);

  const fetchJourney = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journeys/${journeyId}`);
      if (response.ok) {
        const data = await response.json();
        setJourney(data.journey);
      }
    } catch (error) {
      console.error("Error fetching journey:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journeys/${journeyId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Live Journeys
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                {journey.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{journey.location.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Published {new Date(journey.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Live
                  </span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{journey.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{journey.totalVotes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{journey.reviewCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Views</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "reviews", label: "Reviews & Feedback" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Journey Description</h2>
                <p className="text-gray-700 leading-relaxed">{journey.description}</p>
              </div>

              {/* Images */}
              {journey.images.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {journey.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                          alt={`Journey photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Journey Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Details</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{journey.location.city}, {journey.location.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Your Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < journey.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Published:</span>
                    <span className="font-medium">
                      {new Date(journey.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {journey.tags.length > 0 && (
                    <div>
                      <span className="text-gray-500 block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {journey.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews & Feedback ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {review.authorName || "Anonymous"}
                          </span>
                          {review.rating && (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating! ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Over Time</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart placeholder - Views and interactions over time
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart placeholder - Rating distribution
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
