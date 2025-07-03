"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Star,
  Calendar,
  Shield,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from "lucide-react";
import { Journey, User as UserType, Review } from "../types";
import { format } from "date-fns";
import {
  summarizeLocationReviews,
  generateInsights,
  generateAILocationInsights,
} from "@/utils/aiSummarizer";
import { fetchReviews, createReview } from "../actions/journeyActions";
import ReviewModal from "./ReviewModal";
import useGetUserData from "@/hooks/useAddress";
import { toast } from "sonner";

interface JourneyDetailsModalProps {
  journey: Journey | null;
  author: UserType | null;
  allJourneys: Journey[];
  isOpen: boolean;
  onClose: () => void;
  onJourneyUpdated?: () => void; // Optional callback to refresh journey data
}

export default function JourneyDetailsModal({
  journey,
  author,
  allJourneys,
  isOpen,
  onClose,
  onJourneyUpdated,
}: JourneyDetailsModalProps) {
  const { users } = useGetUserData();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch reviews and AI insights when modal opens
  useEffect(() => {
    if (isOpen && journey) {
      loadReviews();
      loadAIInsights();
    }
  }, [isOpen, journey]);

  const loadAIInsights = async () => {
    if (!journey) return;
    
    setLoadingAI(true);
    try {
      // Get all journeys for the same location
      const locationJourneys = allJourneys.filter(
        (j) => j.location.name === journey.location.name
      );
      
      const journeyIds = locationJourneys.map(j => j.id);
      const result = await generateAILocationInsights(journey.location.name, journeyIds);
      
      if (result.success && result.insights) {
        setAiInsights(result.insights);
      } else if (result.message) {
        // Handle insufficient data case
        setAiInsights(`**Notice:** ${result.message}\n\n**Suggestion:** ${result.fallbackInsights?.suggestion || 'Share more detailed experiences to enable AI insights!'}\n\n**Current Data:**\n- ${result.fallbackInsights?.totalJourneys || 0} journeys shared\n- ${result.fallbackInsights?.totalReviews || 0} reviews available`);
      } else {
        // Fallback to local summarization
        setAiInsights(summarizeLocationReviews(locationJourneys));
      }
    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Fallback to local summarization
      const locationJourneys = allJourneys.filter(
        (j) => j.location.name === journey.location.name
      );
      setAiInsights(summarizeLocationReviews(locationJourneys));
    } finally {
      setLoadingAI(false);
    }
  };

  const loadReviews = async () => {
    if (!journey) return;
    
    setLoadingReviews(true);
    try {
      const result = await fetchReviews({ journeyId: journey.id });
      if (result.success) {
        setReviews(result.reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews(); // Reload reviews after submission
    onJourneyUpdated?.(); // Notify parent to refresh journey data
  };

  const handleQuickVote = async (voteType: 'upvote' | 'downvote') => {
    if (!users?.id) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    if (!journey) {
      toast.error('Journey not found');
      return;
    }

    try {
      const result = await createReview({
        journeyId: journey.id,
        userId: users.id,
        voteType,
        rating: voteType === 'upvote' ? 5 : 1 // Auto-assign rating for quick votes
      });

      if (result.success) {
        // Reload reviews to show the new vote
        loadReviews();
        // Notify parent to refresh journey data for updated stats
        onJourneyUpdated?.();
        toast.success(`${voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully!`);
      } else {
        toast.error(result.error || `Failed to ${voteType}`);
      }
    } catch (error) {
      console.error(`Error ${voteType}:`, error);
      toast.error(`Failed to ${voteType}. Please try again.`);
    }
  };

  if (!isOpen || !journey || !author) return null;

  // Get all journeys for the same location for local insights fallback
  const locationJourneys = allJourneys.filter(
    (j) => j.location.name === journey.location.name
  );

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
              <img
                src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.email || author.name || 'anonymous'}`}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
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

          {/* Voting and Review Section */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Community Feedback
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{journey.totalVotes || 0} votes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{journey.reviewCount || 0} reviews</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{Number(journey.averageRating || 0).toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            {/* Quick Vote Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Write Review</span>
              </button>
              <button
                onClick={() => handleQuickVote('upvote')}
                className="px-4 py-3 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Upvote</span>
              </button>
              <button
                onClick={() => handleQuickVote('downvote')}
                className="px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Downvote</span>
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="font-body font-semibold text-gray-800">Recent Reviews</h3>
              
              {loadingReviews ? (
                <div className="text-center py-4 text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorEmail || review.authorName || 'anonymous'}`}
                            alt={review.authorName || 'Anonymous'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900">
                            {review.authorName || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {review.voteType === 'upvote' && (
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          )}
                          {review.voteType === 'downvote' && (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          )}
                          {review.voteType === 'review' && review.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{review.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.voteType === 'upvote' || review.voteType === 'downvote' ? (
                        <div className="flex items-center space-x-2 mt-2">
                          {review.voteType === 'upvote' ? (
                            <>
                              <ThumbsUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Upvoted ✅</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">Downvoted ❌</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          {review.comment && (
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                          )}
                        </>
                      )}
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                          {review.images.slice(0, 3).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`Review image ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {reviews.length > 5 && (
                    <div className="text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Load more reviews
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <h2 className="text-lg font-heading font-semibold text-white">
                    AI Location Insights
                  </h2>
                </div>
                {loadingAI && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                )}
              </div>
            </div>

            <div className="p-6">
              {loadingAI ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6">
                  {/* Parse and display AI insights in sections */}
                  {(() => {
                    const sections = aiInsights.split('**').filter(section => section.trim());
                    const parsedSections: { title: string; content: string }[] = [];
                    
                    for (let i = 0; i < sections.length; i += 2) {
                      if (sections[i] && sections[i + 1]) {
                        parsedSections.push({
                          title: sections[i].replace(':', '').trim(),
                          content: sections[i + 1].trim()
                        });
                      }
                    }

                    return parsedSections.map((section, index) => {
                      const getSectionIcon = (title: string) => {
                        if (title.toLowerCase().includes('overview')) return '🌍';
                        if (title.toLowerCase().includes('experience')) return '✨';
                        if (title.toLowerCase().includes('best for')) return '🎯';
                        if (title.toLowerCase().includes('sentiment')) return '💭';
                        if (title.toLowerCase().includes('tips')) return '💡';
                        return '📍';
                      };

                      const getSectionColor = (title: string) => {
                        if (title.toLowerCase().includes('overview')) return 'from-green-500 to-emerald-500';
                        if (title.toLowerCase().includes('experience')) return 'from-purple-500 to-violet-500';
                        if (title.toLowerCase().includes('best for')) return 'from-orange-500 to-amber-500';
                        if (title.toLowerCase().includes('sentiment')) return 'from-pink-500 to-rose-500';
                        if (title.toLowerCase().includes('tips')) return 'from-cyan-500 to-blue-500';
                        return 'from-gray-500 to-slate-500';
                      };

                      return (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getSectionColor(section.title)} rounded-lg flex items-center justify-center text-white text-sm`}>
                              {getSectionIcon(section.title)}
                            </div>
                            <h3 className="font-heading font-semibold text-gray-900 text-base">
                              {section.title}
                            </h3>
                          </div>
                          
                          <div className="text-gray-700 text-sm leading-relaxed">
                            {section.title.toLowerCase().includes('best for') ? (
                              // Format "Best For" as a list
                              <div className="grid gap-2">
                                {section.content.split('*').filter(item => item.trim() && item.includes(':')).map((item, idx) => {
                                  const [title, description] = item.split(':');
                                  return (
                                    <div key={idx} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <div>
                                        <span className="font-semibold text-gray-900">{title.trim()}</span>
                                        <span className="text-gray-600">: {description.trim()}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : section.title.toLowerCase().includes('tips') ? (
                              // Format tips as a list
                              <div className="grid gap-2">
                                {section.content.split('*').filter(item => item.trim() && item.includes(':')).map((tip, idx) => {
                                  const [title, description] = tip.split(':');
                                  return (
                                    <div key={idx} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <div>
                                        <span className="font-semibold text-gray-900">{title.trim()}</span>
                                        <span className="text-gray-600">: {description.trim()}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              // Regular paragraph content
                              <p className="whitespace-pre-line">{section.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-gray-500 font-medium">No AI insights available at the moment.</p>
                  <p className="text-gray-400 text-sm">Try refreshing or check back later.</p>
                </div>
              )}

              {/* Quick Stats Grid */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{insights.averageRating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Avg Rating</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{insights.totalReviews}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 text-xs">{insights.bestTime}</div>
                  <div className="text-xs text-gray-500">Best Time</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{locationJourneys.length}</div>
                  <div className="text-xs text-gray-500">Journeys</div>
                </div>
              </div>

              {/* Popular Tags */}
              {insights.topTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.topTags.slice(0, 6).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full text-xs shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-gray-900">
                Reviews
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-body text-sm">Write a Review</span>
              </button>
            </div>

            {loadingReviews ? (
              <p className="text-center text-gray-500 py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Be the first to review this journey!
              </p>
            ) : null /* Reviews are already displayed above */}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        journey={journey}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
