// API configuration and utilities for rewards system

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3033';

export const rewardsAPI = {
  // Get user balance and rank information
  getUserBalance: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rewards/user/${userId}/balance`);
    if (!response.ok) throw new Error('Failed to fetch user balance');
    return response.json();
  },

  // Get available rewards
  getRewards: async (filters?: { category?: string; type?: string; available_only?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.available_only) params.append('available_only', 'true');
    
    const response = await fetch(`${API_BASE_URL}/api/rewards?${params}`);
    if (!response.ok) throw new Error('Failed to fetch rewards');
    return response.json();
  },

  // Get user redemption history
  getRedemptionHistory: async (userId: string, options?: { limit?: number; offset?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.status) params.append('status', options.status);

    const response = await fetch(`${API_BASE_URL}/api/rewards/user/${userId}/history?${params}`);
    if (!response.ok) throw new Error('Failed to fetch redemption history');
    return response.json();
  },

  // Redeem a reward
  redeemReward: async (userId: string, rewardId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rewards/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, rewardId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to redeem reward');
    }
    
    return response.json();
  },

  // Get earning tips
  getEarningTips: async () => {
    const response = await fetch(`${API_BASE_URL}/api/rewards/earning-tips`);
    if (!response.ok) throw new Error('Failed to fetch earning tips');
    return response.json();
  },

  // Get rank progress
  getRankProgress: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rewards/user/${userId}/rank-progress`);
    if (!response.ok) throw new Error('Failed to fetch rank progress');
    return response.json();
  },

  // Initialize user stats and missions
  initializeUser: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/rewards/user/${userId}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to initialize user');
    return response.json();
  },
};

// Utility functions
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
};

export const formatPoints = (points: number): string => {
  return points.toLocaleString();
};

// Icon color mappings
export const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; button: string; hover: string } } = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700', hover: 'hover:border-blue-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700', hover: 'hover:border-purple-300' },
    green: { bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700', hover: 'hover:border-green-300' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700', hover: 'hover:border-yellow-300' },
    red: { bg: 'bg-red-100', text: 'text-red-600', button: 'bg-red-600 hover:bg-red-700', hover: 'hover:border-red-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', button: 'bg-indigo-600 hover:bg-indigo-700', hover: 'hover:border-indigo-300' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', button: 'bg-orange-600 hover:bg-orange-700', hover: 'hover:border-orange-300' },
  };
  
  return colorMap[color] || colorMap.blue;
};

// Error handling utility
export const handleAPIError = (error: any): string => {
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};
