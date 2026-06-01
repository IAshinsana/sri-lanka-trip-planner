# Sri Lanka Trip Planner — Open Travel Data + Itinerary Algorithm

> Reference implementation + reusable open data. Live: **https://induwara.lk/tools/trip-planner/sri-lanka**

All **25 Sri Lanka administrative districts × ~150 hand-curated places** with
real GPS coordinates, interest tags, and visit-duration estimates — plus a
no-AI **local itinerary builder** that turns user preferences into a
day-by-day plan in under 50 ms.

## What's in this repo

### `data/sri-lanka-districts.ts`

A structured dataset of every Sri Lankan district:

```ts
District {
  slug: "kandy",
  name: "Kandy",
  province: "Central Province",
  shortTagline: "...",
  intro: "...",
  bestTime: "January to April",
  budgetUSDPerDay: { low: 35, high: 90 },
  hero: { url, alt, credit, creditUrl },     // Wikipedia photo with attribution
  places: [{
    name: "Temple of the Sacred Tooth Relic",
    lat: 7.2936, lng: 80.6413,
    type: "temple",
    description: "...",
    interests: ["culture", "history", "photography"],
    duration: "1.5-2 hours",
  }, ...],
  tips: [...],
}
```

Every place has real GPS coordinates that render correctly on a Leaflet /
Mapbox / Google map. Interest tags let you filter by traveller preference.

### `src/local-planner.ts`

A pure function: `buildLocalTrip({ district, daysCount, interests, budgetTier }) → Trip`.

1. Scores each place against user's interests.
2. Picks top N = days × 4 stops.
3. Clusters into days by geographic proximity (north-south latitude split).
4. Orders each day's stops by nearest-neighbour TSP heuristic (minimises drive time).
5. Returns a complete day-by-day itinerary with highlights, tips and FAQ.

Runtime: ~50 ms. Zero API calls. Zero LLM tokens. Deterministic — same inputs
always produce the same plan, so URLs are sharable and the result is cacheable.

### `src/distance.ts`

Haversine + road-correction + average-speed → walk/tuktuk/car-time estimates.
Accuracy is within ±30 % of Google Maps' estimate for trips under 50 km — fine
for "is this a 5-minute walk or a 2-hour drive?" framing.

### `src/keywords.ts`

Travel-search keyword generator — produces ~30 high-volume search-pattern
keywords per destination (`{X} itinerary`, `things to do in {X}`,
`is {X} worth visiting`, etc.). Useful for any SEO-driven travel content site.

## Use cases

- **Building a Sri Lanka travel site or app** — the district data is hand-checked
  and far more accurate than what an LLM will hallucinate.
- **Research / open data** — useful structured dataset of LK tourist places
  with GPS for academic or NGO mapping.
- **Reference for your own country** — fork the structure, populate it for your
  region. The algorithm works for anywhere.

## Reuse

MIT licensed. Attribution appreciated but not required.

## Coverage

| Coverage | Districts | Places |
|---|---|---|
| Deep (10+ places) | Colombo, Kandy, Galle, Matara, Anuradhapura, Polonnaruwa, Nuwara Eliya, Badulla, Hambantota, Trincomalee | 60+ |
| Mid (5-7 places) | Gampaha, Kalutara, Matale, Jaffna, Mannar, Ampara, Kurunegala, Puttalam, Monaragala, Ratnapura, Kegalle | 55+ |
| Light (2-4 places) | Kilinochchi, Vavuniya, Mullaitivu, Batticaloa | ~12 |

## Contribute

PRs welcome to add places, fix coordinates, or expand light-coverage districts.
Each `DistrictPlace` should have a verified GPS, a 2-sentence description
written from genuine local knowledge (not LLM-generated marketing copy), and
honest interest tags.

## Live

[induwara.lk/tools/trip-planner/sri-lanka](https://induwara.lk/tools/trip-planner/sri-lanka)
