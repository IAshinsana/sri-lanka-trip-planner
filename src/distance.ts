/**
 * Geographic distance + travel-time estimates for trip itineraries.
 *
 * No external service: Haversine straight-line distance × 1.4 (road wiggle
 * factor) ÷ 35 km/h (mixed urban + highway average) gives a useful guideline
 * between consecutive stops without an API call.
 *
 * Accuracy: within ±30 % of Google Maps' estimate for trips under 50 km, which
 * is plenty for "is this a 5-minute walk or a 2-hour drive?" framing.
 */

const EARTH_RADIUS_KM = 6371;
const ROAD_FACTOR = 1.4;       // straight-line → road-network correction
const AVG_SPEED_KMH = 35;      // mixed urban + intercity
const WALK_SPEED_KMH = 4.5;    // brisk walking pace

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface TravelEstimate {
  km: number;          // straight-line distance
  roadKm: number;      // road-corrected distance
  driveMinutes: number;
  walkMinutes: number;
  mode: "walk" | "tuktuk" | "car";
}

export function estimateTravel(lat1: number, lng1: number, lat2: number, lng2: number): TravelEstimate {
  const km = haversineKm(lat1, lng1, lat2, lng2);
  const roadKm = km * ROAD_FACTOR;
  const driveMinutes = Math.max(1, Math.round((roadKm / AVG_SPEED_KMH) * 60));
  const walkMinutes = Math.max(1, Math.round((roadKm / WALK_SPEED_KMH) * 60));
  // Mode hint — sub-1km walkable, sub-5km tuktuk-friendly, longer is car.
  const mode: TravelEstimate["mode"] = roadKm < 1 ? "walk" : roadKm < 5 ? "tuktuk" : "car";
  return { km, roadKm, driveMinutes, walkMinutes, mode };
}

export function formatTravel(e: TravelEstimate): string {
  if (e.mode === "walk") {
    return `~${e.walkMinutes} min walk · ${e.roadKm.toFixed(1)} km`;
  }
  if (e.mode === "tuktuk") {
    return `~${e.driveMinutes} min tuktuk · ${e.roadKm.toFixed(1)} km`;
  }
  // Longer drives — display hours when relevant.
  const hours = Math.floor(e.driveMinutes / 60);
  const mins = e.driveMinutes % 60;
  const time = hours > 0 ? `${hours}h ${mins}m` : `${e.driveMinutes} min`;
  return `~${time} drive · ${e.roadKm.toFixed(1)} km`;
}
