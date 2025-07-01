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

    let bestPosition: GeolocationPosition | null = null;
    let attempts = 0;
    const maxAttempts = 5;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        attempts++;
        const accuracy = position.coords.accuracy;
        
        console.log(`Location attempt ${attempts}: accuracy ±${Math.round(accuracy)}m`);

        // Keep the best position we've seen so far
        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }

        // If we get good accuracy (under 100m), use it immediately
        if (accuracy <= 100) {
          console.log(`Good accuracy achieved: ±${Math.round(accuracy)}m`);
          navigator.geolocation.clearWatch(watchId);
          setState({
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: accuracy,
            loading: false,
            error: null
          });
          return;
        }

        // If we've tried enough times, use the best position we have
        if (attempts >= maxAttempts) {
          console.log(`Max attempts reached. Using best position: ±${Math.round(bestPosition.coords.accuracy)}m`);
          navigator.geolocation.clearWatch(watchId);
          
          // Only accept if accuracy is better than 10km, otherwise show error
          if (bestPosition.coords.accuracy <= 10000) {
            setState({
              coordinates: [bestPosition.coords.longitude, bestPosition.coords.latitude],
              accuracy: bestPosition.coords.accuracy,
              loading: false,
              error: null
            });
          } else {
            setState({
              coordinates: null,
              accuracy: null,
              loading: false,
              error: `Location accuracy too poor (±${Math.round(bestPosition.coords.accuracy/1000)}km). Please try moving to an open area or enable high-accuracy location.`
            });
          }
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again in an open area.';
            break;
        }

        navigator.geolocation.clearWatch(watchId);
        setState({
          coordinates: null,
          accuracy: null,
          loading: false,
          error: errorMessage
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0 // Always get fresh location
      }
    );

    // Auto-timeout after 30 seconds
    setTimeout(() => {
      if (bestPosition && bestPosition.coords.accuracy <= 10000) {
        console.log(`Timeout reached. Using best available position: ±${Math.round(bestPosition.coords.accuracy)}m`);
        navigator.geolocation.clearWatch(watchId);
        setState({
          coordinates: [bestPosition.coords.longitude, bestPosition.coords.latitude],
          accuracy: bestPosition.coords.accuracy,
          loading: false,
          error: null
        });
      } else {
        navigator.geolocation.clearWatch(watchId);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Location timeout. Please try again in an open area with good GPS signal.'
        }));
      }
    }, 30000);
  }, []);

  return {
    ...state,
    getCurrentLocation
  };
}