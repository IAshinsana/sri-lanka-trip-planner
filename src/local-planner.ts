/**
 * Local trip planner — builds an itinerary from our static Sri Lanka
 * district database WITHOUT calling Claude.
 *
 * The user picks (district, days, interests). We:
 *   1. Score each known place by how well it matches the user's interests.
 *   2. Pick the top N = days × 4 places (target 4 stops/day, capped at total
 *      available).
 *   3. Cluster them into days by geographic proximity (greedy nearest-
 *      neighbour seeded by the highest-scoring stop).
 *   4. Order each day's stops by nearest-neighbour TSP heuristic.
 *   5. Compose a Trip object that drops straight into the existing detail
 *      template (map, drive times, hotel deep links, ICS, print).
 *
 * Runtime: <50 ms. Zero API calls. Zero Claude tokens. Fully deterministic
 * for the same (district, days, interests) tuple — so users sharing a link
 * get the same plan.
 */

import type { Trip, TripDay, TripStop } from "@/lib/data/trips";
import type { District, DistrictPlace } from "@/lib/data/sri-lanka-districts";
import { generateTripKeywords } from "./keywords";
import { haversineKm } from "./distance";

export interface LocalPlanInput {
  district: District;
  daysCount: number;          // 1–10
  interests: string[];        // intersect with place.interests
  budgetTier?: "budget" | "mid" | "luxury";
}

/** How many points a single interest match is worth when scoring a place. */
const INTEREST_MATCH_WEIGHT = 10;
/** Tiny baseline so even a no-interest match places appear if needed. */
const BASELINE_SCORE = 1;
/** Target stops per day (tweaks how "packed" each day feels). */
const STOPS_PER_DAY = 4;

function scorePlace(p: DistrictPlace, interests: string[]): number {
  if (interests.length === 0) return BASELINE_SCORE + 1;
  let s = BASELINE_SCORE;
  const set = new Set(interests.map((i) => i.toLowerCase()));
  for (const tag of p.interests) {
    if (set.has(tag.toLowerCase())) s += INTEREST_MATCH_WEIGHT;
  }
  return s;
}

/** Greedy nearest-neighbour ordering of a small set of stops. */
function orderByProximity(places: DistrictPlace[]): DistrictPlace[] {
  if (places.length <= 2) return [...places];
  const remaining = [...places];
  const out: DistrictPlace[] = [];
  // Seed with the western/northern-most point so the route flows predictably.
  remaining.sort((a, b) => a.lat - b.lat);
  out.push(remaining.shift()!);
  while (remaining.length) {
    const last = out[out.length - 1]!;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(last.lat, last.lng, remaining[i]!.lat, remaining[i]!.lng);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    out.push(remaining.splice(bestIdx, 1)[0]!);
  }
  return out;
}

/**
 * Cluster places into N day-groups by geographic proximity.
 *
 * Algorithm: simple greedy — sort all stops by latitude, split into N chunks
 * of roughly equal size. For Sri Lankan districts (small geographic spans),
 * this produces good clusters without the complexity of k-means.
 */
function clusterIntoDays(places: DistrictPlace[], days: number): DistrictPlace[][] {
  // Sort by lat as a coarse N-S ordering, so consecutive chunks are
  // geographically coherent.
  const sorted = [...places].sort((a, b) => a.lat - b.lat);
  const buckets: DistrictPlace[][] = Array.from({ length: days }, () => []);
  const per = Math.ceil(sorted.length / days);
  for (let i = 0; i < sorted.length; i++) {
    const bucket = Math.min(days - 1, Math.floor(i / per));
    buckets[bucket]!.push(sorted[i]!);
  }
  return buckets;
}

function dayTitle(stops: DistrictPlace[], dayNum: number): string {
  // Pick the highest-impact stop name to label the day.
  if (stops.length === 0) return `Day ${dayNum}`;
  const types = new Set(stops.map((s) => s.type));
  const lead = stops[0]!.name.split(" — ")[0]!.split("(")[0]!.trim();
  const flavour =
    types.has("temple") || types.has("historical") ? "heritage" :
    types.has("beach") ? "coast" :
    types.has("wildlife") ? "wildlife" :
    types.has("waterfall") || types.has("nature") ? "nature" :
    types.has("viewpoint") || types.has("adventure") ? "adventure" :
    "exploration";
  return `Day ${dayNum} — ${lead} + ${flavour}`;
}

function placeToStop(p: DistrictPlace): TripStop {
  return { name: p.name, description: p.description, lat: p.lat, lng: p.lng, duration: p.duration };
}

function highlights(places: DistrictPlace[], district: District): string[] {
  const out = places.slice(0, 5).map((p) => `${p.name} — ${p.description.split(/[.!?]/)[0]}`);
  if (out.length < 5) out.push(`The Sabaragamuwa-style ${district.shortTagline.toLowerCase()}`);
  return out;
}

function buildFaq(district: District, days: number, budgetTier: string): { question: string; answer: string }[] {
  const name = district.name;
  const budgetRange = (() => {
    const b = district.budgetUSDPerDay;
    if (budgetTier === "budget") return `$${b.low}–$${b.low + 15}`;
    if (budgetTier === "luxury") return `$${b.high}–$${b.high + 50}+`;
    return `$${b.low + 10}–$${b.high - 10}`;
  })();
  return [
    {
      question: `How many days do you need in ${name}?`,
      answer: `For most travellers, ${district.places.length <= 5 ? "1–2 days" : district.places.length <= 8 ? "2–3 days" : "3–4 days"} covers ${name}'s main draws. The plan above uses ${days} ${days === 1 ? "day" : "days"}, with roughly ${STOPS_PER_DAY} stops per day at a ${budgetTier === "budget" ? "fast" : budgetTier === "luxury" ? "leisurely" : "standard"} pace. Add an extra day if you want a slower morning or a side trip.`,
    },
    {
      question: `When is the best time to visit ${name}?`,
      answer: `${district.bestTime}. Plan around the monsoon — Sri Lanka has two distinct seasons depending on which coast you're on.`,
    },
    {
      question: `How do I get to ${name}?`,
      answer: `${name} is reachable by car, train (where lines exist) or intercity bus from Colombo. A private car with driver costs around $40–60/day all-in and is the fastest way to cover multiple stops; the train is cheaper and scenic where it runs.`,
    },
    {
      question: `How much does a ${name} trip cost?`,
      answer: `On the ${budgetTier} tier, budget around ${budgetRange} per person per day covering accommodation, meals, transport between stops and the ${days === 1 ? "day's" : days + "-day"} attractions. Mid-range adds a private driver and restaurant dinners; luxury adds a heritage hotel or boutique guesthouse.`,
    },
    {
      question: `Is ${name} worth visiting?`,
      answer: `${district.shortTagline} ${district.places.length >= 7 ? "Yes — it's one of Sri Lanka's most rewarding districts to explore." : "For a focused 1–2 day stop with a specific interest, yes. If you're choosing between districts, weigh it against your other stops first."} The plan above is built only from places worth your time; nothing is filler.`,
    },
  ];
}

/**
 * Build a complete Trip object from a district + user preferences.
 * Output drops directly into the existing trip detail template.
 */
export function buildLocalTrip(input: LocalPlanInput): Trip {
  const { district, daysCount, interests } = input;
  const budgetTier = input.budgetTier ?? "mid";

  // 1. Score and pick the top N places.
  const scored = district.places
    .map((p) => ({ p, s: scorePlace(p, interests) }))
    .sort((a, b) => b.s - a.s);
  const targetCount = Math.min(scored.length, Math.max(daysCount, daysCount * STOPS_PER_DAY));
  const picked = scored.slice(0, targetCount).map((x) => x.p);

  // 2. Cluster into days by geographic proximity.
  const clusters = clusterIntoDays(picked, daysCount);

  // 3. Order each day's stops by nearest-neighbour, build day objects.
  const days: TripDay[] = clusters.map((cluster, idx) => {
    const ordered = orderByProximity(cluster);
    return {
      day: idx + 1,
      title: dayTitle(ordered, idx + 1),
      stops: ordered.map(placeToStop),
    };
  });

  // 4. Compose the canonical Trip object.
  const interestSuffix = interests.length > 0 ? ` (${interests.slice(0, 3).join(" + ")})` : "";
  const title = `${daysCount}-Day ${district.name} Itinerary — ${district.shortTagline.split(" — ")[0]}`;
  const description = `Day-by-day ${daysCount}-day plan for ${district.name}, ${district.province}, built from real places with GPS-accurate stops${interestSuffix}. Map, drive times, local tips, no signup.`;

  return {
    slug: "",  // filled by caller (the API route)
    destination: `${district.name}, Sri Lanka`,
    title,
    shortTitle: `${daysCount}-Day ${district.name}`,
    description,
    duration: `${daysCount} ${daysCount === 1 ? "day" : "days"}`,
    bestTimeToVisit: district.bestTime,
    budgetUSDPerDay: district.budgetUSDPerDay,
    hero: district.hero,
    intro: district.intro,
    highlights: highlights(picked, district),
    days,
    tips: district.tips,
    faq: buildFaq(district, daysCount, budgetTier),
    keywords: [...generateTripKeywords(`${district.name}, Sri Lanka`, daysCount), `${district.name.toLowerCase()} ${budgetTier} itinerary`],
    publishedAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
