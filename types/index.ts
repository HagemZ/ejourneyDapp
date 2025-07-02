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
