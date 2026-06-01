/**
 * Keyword generator for trip itineraries.
 *
 * Travel-search queries follow a small set of templated patterns that drive
 * the bulk of organic traffic. These templates aren't guesswork — they're
 * the canonical patterns Google's "People also ask" + autosuggest pull
 * from, and the ones travel sites like Lonely Planet, Nomadic Matt, and
 * The Broke Backpacker target on every destination page.
 *
 * Categories (per destination "X"):
 *   1. Itinerary intent — "X itinerary", "X 3 day itinerary"
 *   2. Things to do — "things to do in X", "places to visit in X" (very high)
 *   3. Guide intent — "X travel guide", "X tourist places"
 *   4. Logistics — "how many days in X", "how to get to X"
 *   5. Cost — "X budget", "X cost per day"
 *   6. Time — "best time to visit X", "X weather"
 *   7. Decision — "is X worth visiting", "is X safe"
 *   8. Niche — "X day trip", "X solo travel", "X for families"
 *
 * Returns a deduped, lowercased list of ~25 search-aligned keywords.
 */

export function generateTripKeywords(destination: string, daysCount: number): string[] {
  // "Sigiriya, Sri Lanka" → short="sigiriya", full="sigiriya, sri lanka"
  const short = destination.split(",")[0]!.trim().toLowerCase();
  const full = destination.toLowerCase();
  const country = destination.split(",").slice(1).map((s) => s.trim()).join(", ").toLowerCase();

  const patterns: string[] = [
    // 1. Itinerary intent — primary
    `${short} itinerary`,
    `${short} ${daysCount} day itinerary`,
    `${daysCount} day ${short} itinerary`,
    `${daysCount} days in ${short}`,
    `${short} ${daysCount} day trip`,
    `${short} trip plan`,

    // 2. Things to do (very high volume globally)
    `things to do in ${short}`,
    `what to do in ${short}`,
    `places to visit in ${short}`,
    `best places to visit in ${short}`,
    `${short} tourist places`,
    `${short} attractions`,
    `${short} sightseeing`,

    // 3. Guide intent
    `${short} travel guide`,
    `${short} tour plan`,
    `${short} travel tips`,

    // 4. Logistics
    `how many days in ${short}`,
    `${short} for ${daysCount} days`,
    `how to get to ${short}`,

    // 5. Cost
    `${short} budget`,
    `${short} cost per day`,
    `${short} trip cost`,

    // 6. Time
    `best time to visit ${short}`,
    `${short} weather`,

    // 7. Decision
    `is ${short} worth visiting`,

    // 8. Niche
    `${short} day trip`,
    `${short} hidden gems`,
  ];

  // Country-qualified variants — useful when destination shares its name with
  // a more-famous place (e.g. "Lisbon, Iowa" vs "Lisbon, Portugal").
  if (country) {
    patterns.push(`${short} ${country} itinerary`);
    patterns.push(`things to do in ${short} ${country}`);
    patterns.push(`${full} travel guide`);
  }

  // Dedupe + cap.
  return Array.from(new Set(patterns)).slice(0, 30);
}
