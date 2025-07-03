/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if two locations are within a specified radius
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @param radiusMeters Radius in meters
 * @returns true if locations are within radius
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMeters: number = 50
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusMeters;
}

/**
 * Find nearby journeys within a specified radius
 * @param targetLat Target latitude
 * @param targetLon Target longitude
 * @param journeys Array of journeys to check
 * @param radiusMeters Radius in meters (default 50)
 * @returns Array of nearby journeys with their distances
 */
export interface NearbyJourney {
  journey: any;
  distance: number;
}

export function findNearbyJourneys(
  targetLat: number,
  targetLon: number,
  journeys: any[],
  radiusMeters: number = 50
): NearbyJourney[] {
  return journeys
    .map(journey => ({
      journey,
      distance: calculateDistance(
        targetLat,
        targetLon,
        journey.locationLat || journey.location?.coordinates[1],
        journey.locationLng || journey.location?.coordinates[0]
      )
    }))
    .filter(({ distance }) => distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);
}
