import { Journey } from '@/types';

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