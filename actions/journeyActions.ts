"use server";

import { Journey } from "@/types";

export interface CreateJourneyRequest {
  userId: string; // Add user ID
  title: string;
  description: string;
  rating: number;
  tags: string[];
  images: string[]; // URLs after upload
  location: {
    name: string;
    coordinates: [number, number];
  };
  verifiedLocation: boolean;
  verificationLocation?: [number, number];
  shareType: 'live' | 'draft' | 'scheduled';
  scheduledAt?: string; // ISO date string for scheduled posts
}

export interface CreateJourneyResponse {
  success: boolean;
  journey?: Journey;
  error?: string;
}

export async function createJourney(data: CreateJourneyRequest): Promise<CreateJourneyResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journeys/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create journey',
      };
    }

    return {
      success: true,
      journey: result.journey,
    };
  } catch (error) {
    console.error('Error creating journey:', error);
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

export async function uploadImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/images`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to upload images',
      };
    }

    return {
      success: true,
      urls: result.urls,
    };
  } catch (error) {
    console.error('Error uploading images:', error);
    return {
      success: false,
      error: 'Network error occurred during upload',
    };
  }
}

export interface FetchJourneysRequest {
  userId?: string;
  status?: 'active' | 'inactive' | 'scheduled';
  shareType?: 'live' | 'draft' | 'scheduled';
  limit?: number;
  offset?: number;
}

export interface FetchJourneysResponse {
  success: boolean;
  journeys?: Journey[];
  error?: string;
}

export async function fetchJourneys(params: FetchJourneysRequest = {}): Promise<FetchJourneysResponse> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.userId) searchParams.append('userId', params.userId);
    if (params.status) searchParams.append('status', params.status);
    if (params.shareType) searchParams.append('shareType', params.shareType);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/journeys?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    const result = await response.json();

    console.log('Raw API response:', result);
    console.log('Journeys from API:', result.journeys);
    
    // Debug each journey's images
    if (result.journeys) {
      result.journeys.forEach((journey: any, index: number) => {
        console.log(`API Journey ${index + 1} "${journey.title}":`, {
          id: journey.id,
          hasImages: journey.images && journey.images.length > 0,
          imageCount: journey.images ? journey.images.length : 0,
          images: journey.images
        });
      });
    }

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to fetch journeys',
      };
    }

    return {
      success: true,
      journeys: result.journeys || [],
    };
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return {
      success: false,
      error: 'Network error occurred while fetching journeys',
    };
  }
}
