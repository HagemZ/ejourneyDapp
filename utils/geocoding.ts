/**
 * Reverse geocoding utilities to convert coordinates to readable location names
 * Uses our backend API to avoid CORS issues and rate limiting
 */

export interface ReverseGeocodeResult {
  success: boolean;
  locationName?: string;
  city?: string;
  country?: string;
  error?: string;
}

/**
 * Get location name from coordinates using our backend reverse geocoding API
 */
export async function getReverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reverse-geocode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success || false,
      locationName: data.locationName || 'My Location',
      city: data.city || 'Unknown',
      country: data.country || 'Unknown',
      error: data.error,
    };

  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    
    // Return user-friendly fallback
    return {
      success: false,
      locationName: 'My Location',
      city: 'Unknown',
      country: 'Unknown',
      error: error instanceof Error ? error.message : 'Failed to get location name',
    };
  }
}
