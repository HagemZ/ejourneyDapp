// Journey API service functions

const API_BASE_URL = 'http://localhost:3033/api';

export interface JourneyCounts {
  live: number;
  draft: number;
  scheduled: number;
  total: number;
}

export interface UserJourneyCountsResponse {
  success: boolean;
  data: JourneyCounts;
}

export interface JourneysByTypeResponse {
  success: boolean;
  data: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface AdminJourneyCountsResponse {
  success: boolean;
  overallSummary: JourneyCounts;
  userSummary: Array<{
    userId: string;
    fullname: string;
    email: string;
    counts: JourneyCounts;
  }>;
  totalUsers: number;
}

// Get journey counts by shareType for a specific user
export async function getUserJourneyCounts(userId: string): Promise<UserJourneyCountsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/journey-counts`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user journey counts:', error);
    throw error;
  }
}

// Get detailed journeys by shareType for a specific user
export async function getUserJourneysByType(
  userId: string, 
  shareType?: 'live' | 'draft' | 'scheduled',
  limit: number = 20,
  offset: number = 0
): Promise<JourneysByTypeResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    if (shareType) {
      params.append('shareType', shareType);
    }
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/journeys-by-type?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user journeys by type:', error);
    throw error;
  }
}

// Get admin journey counts summary (for admin/analytics)
export async function getAdminJourneyCountsSummary(): Promise<AdminJourneyCountsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/journey-counts-summary`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin journey counts summary:', error);
    throw error;
  }
}

// Helper function to get current user ID
export function getCurrentUserId(): string {
  // This function should be used carefully - prefer passing userId explicitly
  // when possible rather than using this hardcoded fallback
  console.warn('getCurrentUserId() called - consider using wallet address or user data directly');
  return '1a2cc4fe-ca35-4eb0';
}

// Helper function to get user ID from wallet address or user data
export async function getUserIdFromAddress(walletAddress: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
    if (response.ok) {
      const data = await response.json();
      return data.data?.id || walletAddress; // Return registered ID or fallback to address
    }
    return walletAddress; // Fallback to wallet address if user not found
  } catch (error) {
    console.error('Error fetching user ID from address:', error);
    return walletAddress; // Fallback to wallet address on error
  }
}

// Helper function to format journey count display
export function formatJourneyCountDisplay(counts: JourneyCounts, type: keyof JourneyCounts): string {
  const count = counts[type];
  if (typeof count === 'number') {
    return count > 99 ? '99+' : count.toString();
  }
  return '0';
}

// Helper function to check if user has journeys of specific type
export function hasJourneysOfType(counts: JourneyCounts, type: 'live' | 'draft' | 'scheduled'): boolean {
  return counts[type] > 0;
}

// Helper function to get total active journeys (live + scheduled)
export function getActiveJourneysCount(counts: JourneyCounts): number {
  return counts.live + counts.scheduled;
}

// Helper function to get journey status color
export function getJourneyStatusColor(status: 'live' | 'draft' | 'scheduled'): string {
  switch (status) {
    case 'live':
      return 'text-green-600 bg-green-50';
    case 'draft':
      return 'text-blue-600 bg-blue-50';
    case 'scheduled':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Helper function to get journey status icon
export function getJourneyStatusIcon(status: 'live' | 'draft' | 'scheduled'): string {
  switch (status) {
    case 'live':
      return '📻';
    case 'draft':
      return '📝';
    case 'scheduled':
      return '📅';
    default:
      return '📄';
  }
}
