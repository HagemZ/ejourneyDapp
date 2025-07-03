"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Star, ThumbsUp, ThumbsDown, Camera } from "lucide-react";
import { Journey } from "../types";
import useGetUserData from "@/hooks/useAddress";
import { createReview, uploadImages } from "../actions/journeyActions";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: Journey | null;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  journey,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { users } = useGetUserData();
  const [submitting, setSubmitting] = useState(false);
  const [reviewType, setReviewType] = useState<'review' | 'upvote' | 'downvote'>('review');

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: "",
      images: [],
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .required("Rating is required"),
      comment: Yup.string()
        .when('reviewType', {
          is: 'review',
          then: (schema) => schema.min(10, "Comment must be at least 10 characters for reviews"),
          otherwise: (schema) => schema
        }),
      images: Yup.array()
        .of(Yup.mixed())
        .max(3, "Maximum 3 images allowed")
        .test(
          'fileSize',
          'Each image must be less than 5MB',
          function (value) {
            if (!value || value.length === 0) return true;
            return value.every((file: any) => file && file.size <= 5 * 1024 * 1024);
          }
        ),
    }),
    onSubmit: async (data) => {
      if (!users || !journey) return;

      setSubmitting(true);
      try {
        let imageUrls: string[] = [];

        // Upload images if any
        if (data.images.length > 0) {
          const uploadResult = await uploadImages(data.images);
          if (uploadResult.success && uploadResult.urls) {
            imageUrls = uploadResult.urls;
          } else {
            toast.error(uploadResult.error || 'Failed to upload images');
            setSubmitting(false);
            return;
          }
        }

        // Create review
        const reviewData = {
          journeyId: journey.id,
          userId: users.id,
          rating: reviewType === 'review' ? data.rating : (reviewType === 'upvote' ? 5 : 1),
          comment: reviewType === 'review' ? data.comment : undefined,
          images: imageUrls,
          voteType: reviewType,
        };

        const result = await createReview(reviewData);

        if (result.success) {
          toast.success(
            reviewType === 'review' ? 'Review submitted successfully!' :
            reviewType === 'upvote' ? 'Upvote submitted!' : 'Downvote submitted!'
          );
          formik.resetForm();
          onReviewSubmitted();
          onClose();
        } else {
          toast.error(result.error || 'Failed to submit review');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formik.values.images.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }
    
    formik.setFieldValue('images', [...formik.values.images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue('images', newImages);
  };

  if (!isOpen || !journey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Review Journey
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Journey Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">{journey.title}</h4>
          <p className="text-sm text-gray-600">{journey.location.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            By {journey.authorName || 'Anonymous'}
          </p>
        </div>

        {/* Review Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How do you want to respond?
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setReviewType('upvote')}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                reviewType === 'upvote'
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className="w-4 h-4 inline mr-1" />
              Upvote
            </button>
            <button
              type="button"
              onClick={() => setReviewType('downvote')}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                reviewType === 'downvote'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className="w-4 h-4 inline mr-1" />
              Downvote
            </button>
            <button
              type="button"
              onClick={() => setReviewType('review')}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                reviewType === 'review'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Review
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Rating (only for reviews) */}
          {reviewType === 'review' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => formik.setFieldValue('rating', index + 1)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        index < formik.values.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.rating}</p>
              )}
            </div>
          )}

          {/* Comment (required for reviews, optional for votes) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment {reviewType === 'review' ? '*' : '(Optional)'}
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={
                reviewType === 'review'
                  ? "Share your detailed experience..."
                  : "Add an optional comment..."
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {formik.touched.comment && formik.errors.comment && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.comment}</p>
            )}
          </div>

          {/* Images (optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional)
            </label>
            
            {/* Image upload */}
            <div className="flex items-center space-x-2 mb-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 transition-colors">
                <Camera className="w-4 h-4 inline mr-1" />
                Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500">
                Max 3 images, 5MB each
              </span>
            </div>

            {/* Image preview */}
            {formik.values.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formik.values.images.map((file: File, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !users}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 
               reviewType === 'review' ? 'Submit Review' :
               reviewType === 'upvote' ? 'Submit Upvote' : 'Submit Downvote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
