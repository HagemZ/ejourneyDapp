import { useState, useCallback } from 'react';

interface GeolocationState {
  coordinates: [number, number] | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    accuracy: null,
    loading: false,
    error: null
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    // Function to attempt getting location with retries for better accuracy
    const attemptLocationFetch = (attempt = 1, maxAttempts = 3) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy;
          
          // If accuracy is better than 60 meters or we've tried enough times, use this position
          if (accuracy <= 60 || attempt >= maxAttempts) {
            setState({
              coordinates: [position.coords.longitude, position.coords.latitude],
              accuracy: accuracy,
              loading: false,
              error: null
            });
          } else {
            // If accuracy is not good enough and we haven't exhausted attempts, try again
            setTimeout(() => attemptLocationFetch(attempt + 1, maxAttempts), 1000);
          }
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }

          setState({
            coordinates: null,
            accuracy: null,
            loading: false,
            error: errorMessage
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout for better accuracy
          maximumAge: 60000 // Reduced cache time to 1 minute for more accurate results
        }
      );
    };

    attemptLocationFetch();
  }, []);

  return {
    ...state,
    getCurrentLocation
  };
}