import { Journey, Review } from '@/types';

const API_BASE_URL = 'http://localhost:3033';

/**
 * Generate AI-powered location insights using the backend Gemini API
 */
export async function generateAILocationInsights(locationName: string, journeyIds?: string[]): Promise<{
  success: boolean;
  insights?: string;
  metadata?: any;
  error?: string;
  fallbackInsights?: any;
  message?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/location-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationName,
        journeyIds,
        forceGenerate: false // Only generate if there's substantial content
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate AI insights'
    };
  }
}

/**
 * Generate AI-powered location summary
 */
export async function generateAILocationSummary(locationName: string, description?: string): Promise<{
  success: boolean;
  summary?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/location-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationName,
        description
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate AI summary'
    };
  }
}

/**
 * Get AI-powered travel trends
 */
export async function getAITravelTrends(): Promise<{
  success: boolean;
  trends?: string;
  metadata?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/travel-trends`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting AI travel trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get AI travel trends'
    };
  }
}

/**
 * Fallback local summarization for when AI services are unavailable
 */
export function summarizeLocationReviews(journeys: Journey[]): string {
  if (journeys.length === 0) return 'No reviews available for this location.';

  const totalRating = journeys.reduce((sum, journey) => sum + journey.rating, 0);
  const avgRating = (totalRating / journeys.length).toFixed(1);
  
  const commonTags = journeys
    .flatMap(journey => journey.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topTags = Object.entries(commonTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  const highlights = journeys
    .map(journey => journey.description)
    .join(' ')
    .split(/[.!?]+/)
    .filter(sentence => sentence.length > 20)
    .slice(0, 2);

  return `Based on ${journeys.length} review${journeys.length > 1 ? 's' : ''}, this location has an average rating of ${avgRating}/5. 
Travelers particularly enjoy: ${topTags.join(', ')}. 
Key highlights: ${highlights.join('. ')}.`;
}

export function generateInsights(journeys: Journey[]): {
  averageRating: number;
  totalReviews: number;
  topTags: string[];
  bestTime: string;
} {
  const totalReviews = journeys.length;
  const averageRating = journeys.reduce((sum, j) => sum + j.rating, 0) / totalReviews;
  
  const tagCounts = journeys
    .flatMap(j => j.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  // Mock best time based on creation dates
  const bestTime = 'Spring to Fall';

  return {
    averageRating,
    totalReviews,
    topTags,
    bestTime
  };
}