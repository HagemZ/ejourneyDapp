export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface Journey {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    country: string;
    city: string;
  };
  images: string[];
  rating: number;
  tags: string[];
  createdAt: Date;
  verifiedLocation: boolean;
  authorName?: string; // Author's full name from backend
  authorEmail?: string; // Author's email from backend
  // New fields for unique location system
  totalVotes: number;
  averageRating: number;
  reviewCount: number;
}

export interface LocationSuggestion {
  name: string;
  coordinates: [number, number];
  country: string;
  city: string;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
}

export interface Review {
  id: string;
  journeyId: string;
  userId: string;
  voteType: 'upvote' | 'downvote' | 'review';
  rating?: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
  // User info from backend
  authorName?: string;
  authorEmail?: string;
}

export interface CreateReviewRequest {
  journeyId: string;
  voteType: 'upvote' | 'downvote' | 'review';
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface FetchReviewsRequest {
  journeyId: string;
}
