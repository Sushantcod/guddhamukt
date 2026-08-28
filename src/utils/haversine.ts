import { Issue, IssueCategory } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth
 * using the Haversine formula in meters.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface DuplicateMatchResult {
  isDuplicate: boolean;
  matchedIssue?: Issue;
  distanceMeters?: number;
}

/**
 * Detects if an unresolved issue of the same category exists within 60 meters
 */
export function findNearbyDuplicateIssue(
  issues: Issue[],
  targetLat: number,
  targetLng: number,
  targetCategory: IssueCategory,
  thresholdMeters = 60
): DuplicateMatchResult {
  // Only check unresolved issues
  const openIssues = issues.filter(
    (issue) => issue.status !== 'Resolved' && issue.status !== 'Citizen Verified'
  );

  let closestMatch: Issue | null = null;
  let minDistance = Infinity;

  for (const issue of openIssues) {
    if (issue.category === targetCategory) {
      const distance = calculateHaversineDistanceMeters(
        targetLat,
        targetLng,
        issue.latitude,
        issue.longitude
      );

      if (distance <= thresholdMeters && distance < minDistance) {
        minDistance = distance;
        closestMatch = issue;
      }
    }
  }

  if (closestMatch && minDistance <= thresholdMeters) {
    return {
      isDuplicate: true,
      matchedIssue: closestMatch,
      distanceMeters: minDistance,
    };
  }

  return { isDuplicate: false };
}
