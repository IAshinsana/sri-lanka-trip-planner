/**
 * Sri Lanka districts + their notable places — the data layer behind the
 * instant local trip planner.
 *
 * Architecture: this file is the static, version-controlled source of truth.
 * The local-planner (`lib/trip-planner/local-planner.ts`) reads from here
 * to compute itineraries instantly — no Claude call, no API request, no
 * generation latency. Claude only fires when the user explicitly clicks
 * "Generate with AI for anywhere".
 *
 * Coverage:
 *   - 25/25 official Sri Lanka districts
 *   - ~150 hand-curated places with real GPS coordinates
 *   - Tagged with interests so the planner can match a user's preferences
 *
 * Adding places: pick real lat/lng from Google Maps. Interest tags should
 * match the chips in components/trip-planner/sri-lanka-form.tsx.
 */

export type PlaceType =
  | "temple" | "beach" | "historical" | "museum" | "nature"
  | "market" | "viewpoint" | "waterfall" | "wildlife" | "food"
  | "adventure" | "culture" | "garden" | "fort";

export interface DistrictPlace {
  name: string;
  lat: number;
  lng: number;
  type: PlaceType;
  description: string;
  interests: string[];     // intersects with user's chosen interests
  duration: string;        // "1-2 hours"
}

export interface District {
  slug: string;
  name: string;
  province: string;
  shortTagline: string;
  intro: string;
  bestTime: string;
  budgetUSDPerDay: { low: number; high: number };
  hero: { url: string; alt: string; credit: string; creditUrl: string };
  places: DistrictPlace[];
  tips: string[];
}

/**
 * Tolerant Wikimedia photo URL builder — accepts either of the two formats
 * I copy-pasted from Commons:
 *   1. Plain: "x/yy/Filename.jpg" (the "/wiki/File:" page path)
 *   2. Full thumb: "thumb/x/yy/Filename.jpg/1280px-Filename.jpg" (browser URL)
 * Output is always the canonical 1280px thumb URL.
 */
function wikipediaPhoto(page: string, file: string, alt: string) {
  let path = file;
  // Strip leading "thumb/" + trailing "/Npx-..." if the input was already a thumb URL.
  if (path.startsWith("thumb/")) {
    path = path.slice("thumb/".length).replace(/\/\d+px-[^/]+$/, "");
  }
  const filename = path.split("/").pop()!;
  return {
    url: `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/1280px-${filename}`,
    alt,
    credit: `Wikipedia · ${page}`,
    creditUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page)}`,
  };
}

export const DISTRICTS: District[] = [
  // ─── WESTERN PROVINCE ─────────────────────────────────────────────────
  {
    slug: "colombo",
    name: "Colombo",
    province: "Western Province",
    shortTagline: "Sri Lanka's commercial capital — colonial streets, modern skyline, ocean breeze.",
    intro: "Colombo is the country's commercial heart and easiest landing pad — a 30-minute drive from Bandaranaike airport. A day or two covers the Pettah markets, the Galle Face seafront, the old British/Dutch quarters, and a couple of the modern landmarks like the Lotus Tower. Most travellers use it as a transit base, but it rewards a careful wander.",
    bestTime: "December to March (dry season, less humid)",
    budgetUSDPerDay: { low: 35, high: 110 },
    hero: wikipediaPhoto("Colombo", "8/8c/Colombo_Skyline.jpg", "Colombo skyline at twilight"),
    places: [
      { name: "Galle Face Green", lat: 6.9269, lng: 79.8439, type: "viewpoint", description: "Oceanfront promenade where the city comes to fly kites, eat street isso vade and watch the sun go down. Best at 5–7pm.", interests: ["food", "culture", "family-friendly"], duration: "1-2 hours" },
      { name: "Gangaramaya Temple", lat: 6.9165, lng: 79.8569, type: "temple", description: "Buddhist temple by Beira Lake — eclectic museum-meets-monastery with relics, vintage cars and a small library.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Pettah Market", lat: 6.9376, lng: 79.8526, type: "market", description: "Loud, dense bazaar district north of Fort — wholesale fabric, spices, electronics. Go before noon and bring patience.", interests: ["shopping", "culture", "food"], duration: "1-2 hours" },
      { name: "National Museum", lat: 6.9106, lng: 79.8615, type: "museum", description: "Sri Lanka's largest museum — sword of the last Kandyan king, ola-leaf manuscripts, demon masks. Closed Fridays.", interests: ["history", "culture"], duration: "1.5-2 hours" },
      { name: "Independence Memorial Hall", lat: 6.9019, lng: 79.8674, type: "historical", description: "Stone replica of a Kandyan audience hall built to mark 1948 independence. Surrounding park is a quiet morning walk.", interests: ["history", "photography"], duration: "30 min" },
      { name: "Lotus Tower", lat: 6.9272, lng: 79.8612, type: "viewpoint", description: "350m communications tower with a viewing deck — sharpest panorama of the city and coastline at sunset.", interests: ["photography", "family-friendly"], duration: "1 hour" },
      { name: "Dutch Hospital Shopping Precinct", lat: 6.9344, lng: 79.8431, type: "food", description: "Restored 17th-century building, now restaurants and boutique shops — Ministry of Crab and Colombo Fort Café anchor the strip.", interests: ["food", "shopping", "nightlife"], duration: "1.5-2 hours" },
      { name: "Viharamahadevi Park", lat: 6.9152, lng: 79.8616, type: "garden", description: "Largest park in Colombo — old colonial trees, a bandstand and a calm break from city noise.", interests: ["nature", "family-friendly"], duration: "45 min" },
    ],
    tips: [
      "Use PickMe or Uber over street tuktuks — tourist haggling is real here.",
      "Most cultural sites close on poya (full moon) days — check the lunar calendar.",
      "Galle Face street food is safe to eat from 5pm onwards when stalls turn over fast.",
      "Don't drive yourself in Colombo — traffic is dense and parking is scarce.",
    ],
  },
  {
    slug: "gampaha",
    name: "Gampaha",
    province: "Western Province",
    shortTagline: "Negombo beach, the airport district and ancient temples.",
    intro: "Gampaha district wraps around the north of Colombo and contains the international airport. Negombo town on the coast is the classic first/last night base — calm beach, working fishing harbour, easy transfers. Inland are wetlands and a botanical garden most visitors skip.",
    bestTime: "December to March",
    budgetUSDPerDay: { low: 30, high: 90 },
    hero: wikipediaPhoto("Negombo", "9/9a/Negombo_Beach_resort_pool_%28Unsplash%29.jpg", "Negombo Beach"),
    places: [
      { name: "Negombo Beach", lat: 7.2167, lng: 79.8333, type: "beach", description: "Long sandy beach 15 min from the airport. Not the country's best for swimming, but the most convenient.", interests: ["beaches", "family-friendly"], duration: "1-2 hours" },
      { name: "Negombo Lagoon", lat: 7.1833, lng: 79.8333, type: "nature", description: "Mangrove-lined lagoon — boat tours spot kingfishers, monitors and the local outrigger fishing fleet.", interests: ["nature", "adventure", "photography"], duration: "2 hours" },
      { name: "Negombo Fish Market", lat: 7.2167, lng: 79.8500, type: "market", description: "Dawn auction at Lellama market — drying fish in the sun, freshly-landed tuna and skipjack. Go before 8am.", interests: ["food", "photography", "culture"], duration: "1 hour" },
      { name: "St Mary's Church", lat: 7.2167, lng: 79.8389, type: "historical", description: "Vast Catholic basilica with painted ceilings — testament to Negombo's strong Portuguese-Catholic identity.", interests: ["history", "culture"], duration: "30 min" },
      { name: "Henarathgoda Botanical Gardens", lat: 7.0833, lng: 80.0000, type: "garden", description: "Smaller than Peradeniya but cooler, with the country's first rubber trees and a calm pond. Good half-day stop.", interests: ["nature", "family-friendly"], duration: "1.5 hours" },
    ],
    tips: [
      "Negombo is the right base for a first/last night — airport is 15 min away by tuktuk.",
      "Skip swimming at Negombo's main beach in the September–November monsoon; rough water.",
      "Fish market is most active right after sunrise — set an alarm.",
    ],
  },
  {
    slug: "kalutara",
    name: "Kalutara",
    province: "Western Province",
    shortTagline: "Beach district south of Colombo — Beruwala, Bentota and Kalutara Bo Tree.",
    intro: "Kalutara stretches down the west coast just south of Colombo and is the southern half of the country's classic resort belt. Bentota and Beruwala have the wider beaches; the town itself is a stopover with one of the country's most-visited Buddhist sites.",
    bestTime: "November to April",
    budgetUSDPerDay: { low: 35, high: 130 },
    hero: wikipediaPhoto("Kalutara_Bodhiya", "2/2a/Kalautara_Bodhiya_1.jpg", "Kalutara Bodhiya"),
    places: [
      { name: "Kalutara Bodhiya", lat: 6.5854, lng: 79.9607, type: "temple", description: "Sacred bodhi tree shrine at the Kalu Ganga river mouth — drivers stop to drop coins for a safe journey south.", interests: ["culture", "history"], duration: "30 min" },
      { name: "Beruwala Beach", lat: 6.4787, lng: 79.9824, type: "beach", description: "Sheltered horseshoe bay — one of the calmest beaches on the west coast, popular for swimming.", interests: ["beaches", "family-friendly"], duration: "2-3 hours" },
      { name: "Bentota Beach", lat: 6.4264, lng: 79.9947, type: "beach", description: "Long open sand with a river mouth at one end — water sports (jet ski, banana boat) on the river, swim on the sea side.", interests: ["beaches", "adventure", "family-friendly"], duration: "3-4 hours" },
      { name: "Brief Garden (Bevis Bawa)", lat: 6.4500, lng: 80.0000, type: "garden", description: "Sculpted estate designed by architect Bevis Bawa (Geoffrey's brother). Quirky topiary, sculpture, modernist house.", interests: ["culture", "nature", "photography"], duration: "1.5 hours" },
      { name: "Madu Ganga River Safari", lat: 6.3733, lng: 80.0500, type: "nature", description: "Boat tour through mangrove islands, cinnamon farms and a temple on an island. ~2 hour ride.", interests: ["nature", "photography", "family-friendly"], duration: "2 hours" },
    ],
    tips: [
      "Avoid the west coast May–October — monsoon season, rough seas, most resorts cut prices but it rains daily.",
      "Bentota River is calmer than the sea for kids — choose river-side water sports first.",
      "Drop a coin at Kalutara Bodhiya if you're driving further south; it's a local tradition.",
    ],
  },

  // ─── CENTRAL PROVINCE ────────────────────────────────────────────────
  {
    slug: "kandy",
    name: "Kandy",
    province: "Central Province",
    shortTagline: "Hill capital, sacred tooth temple, gateway to the highlands.",
    intro: "Kandy is the cultural heart of Sri Lanka — the last royal capital, home of the Temple of the Sacred Tooth Relic, and a 500m-altitude lake-side town where the climate softens from coastal heat to a permanent spring. Three days here covers the temple, the gardens, a tea-country morning, and a Pinnawala or Sigiriya day trip.",
    bestTime: "January to April",
    budgetUSDPerDay: { low: 35, high: 90 },
    hero: wikipediaPhoto("Kandy", "thumb/9/97/Kandy_Lake_with_Sri_Dalada_Maligawa.jpg/1280px-Kandy_Lake_with_Sri_Dalada_Maligawa.jpg", "Temple of the Tooth and Kandy Lake"),
    places: [
      { name: "Temple of the Sacred Tooth Relic", lat: 7.2936, lng: 80.6413, type: "temple", description: "Sri Lanka's holiest Buddhist site. Aim for puja at 5:30am, 9:30am or 6:30pm. Cover shoulders and knees.", interests: ["culture", "history", "photography"], duration: "1.5-2 hours" },
      { name: "Kandy Lake", lat: 7.2906, lng: 80.6403, type: "viewpoint", description: "Man-made lake built in 1807 by the last Kandyan king. Loop walk is 45 min with the classic temple-and-water view.", interests: ["nature", "photography"], duration: "45 min" },
      { name: "Royal Botanical Gardens (Peradeniya)", lat: 7.2715, lng: 80.5953, type: "garden", description: "60-hectare gardens — orchid house, the giant Javan fig tree, avenue of royal palms. Best late afternoon.", interests: ["nature", "family-friendly", "photography"], duration: "2-3 hours" },
      { name: "Bahirawakanda Buddha", lat: 7.3023, lng: 80.6235, type: "temple", description: "88-foot white Buddha overlooking the city. Steep tuktuk ride up. Best panoramic view of Kandy.", interests: ["culture", "photography", "viewpoint"], duration: "45 min" },
      { name: "Embekka Devalaya", lat: 7.2200, lng: 80.5894, type: "temple", description: "16th-century wooden temple famous for some of the finest wood carvings in South Asia. 40 min drive.", interests: ["history", "culture", "photography"], duration: "1 hour" },
      { name: "Kandy Cultural Centre (dance)", lat: 7.2925, lng: 80.6336, type: "culture", description: "Hour-long traditional Kandyan dance + fire-walking performance daily at 5pm. Touristy but legit good.", interests: ["culture", "family-friendly"], duration: "1 hour" },
      { name: "Udawattekele Forest Reserve", lat: 7.2997, lng: 80.6427, type: "nature", description: "Forested ridge behind the temple — birdwatching trail, monkeys, cool air. Skip during/after rain (leeches).", interests: ["nature", "hiking", "photography"], duration: "1.5-2 hours" },
      { name: "Hantana Mountain Range", lat: 7.2620, lng: 80.6200, type: "viewpoint", description: "Tea-covered ridges south of the city. Drive up at sunset for the layered-hills view back over Kandy.", interests: ["nature", "photography", "tea"], duration: "1 hour" },
    ],
    tips: [
      "Get a private driver (~$40/day) for day trips out of Kandy.",
      "Pre-book during Esala Perahera (late July/early August) — the city is packed.",
      "Train from Kandy to Ella is the world-famous scenic ride — book reserved seats 30 days ahead.",
      "Climate is 5–8°C cooler than Colombo — pack a light layer.",
    ],
  },
  {
    slug: "matale",
    name: "Matale",
    province: "Central Province",
    shortTagline: "Sigiriya, Dambulla caves and the spice gardens belt.",
    intro: "Matale district contains the country's two biggest archaeological draws — Sigiriya rock fortress and the Dambulla cave temples — plus the spice gardens visitors stop at on the Colombo–Kandy road. A two-day base in Sigiriya village covers both UNESCO sites.",
    bestTime: "January to April",
    budgetUSDPerDay: { low: 35, high: 110 },
    hero: wikipediaPhoto("Sigiriya", "e/e6/Sigiriya_%28141688197%29.jpeg", "Sigiriya rock fortress"),
    places: [
      { name: "Sigiriya Rock Fortress", lat: 7.9568, lng: 80.7603, type: "historical", description: "5th-century rock palace with fresco galleries, mirror wall and lion-paw gate. Climb at sunrise to beat heat and crowds.", interests: ["history", "hiking", "photography"], duration: "3-4 hours" },
      { name: "Dambulla Cave Temple", lat: 7.8567, lng: 80.6492, type: "temple", description: "Five caves carved with 150+ Buddha statues and frescoes spanning two millennia. UNESCO site.", interests: ["history", "culture"], duration: "1.5 hours" },
      { name: "Pidurangala Rock", lat: 7.9637, lng: 80.7589, type: "viewpoint", description: "Cheaper-cousin rock to Sigiriya — the BEST view of Sigiriya is from up here at sunrise. Steep final scramble.", interests: ["hiking", "photography", "adventure"], duration: "2 hours" },
      { name: "Aluvihare Rock Temple", lat: 7.4759, lng: 80.6258, type: "temple", description: "Where the Pali Canon was first written down on ola leaves in the 1st century BC. Quiet and rarely crowded.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Matale Spice Gardens (multiple)", lat: 7.4675, lng: 80.6234, type: "garden", description: "Cinnamon, cardamom, pepper, vanilla — free walking tours hoping for a purchase. No pressure to buy.", interests: ["food", "nature"], duration: "45 min" },
      { name: "Nalanda Gedige", lat: 7.6731, lng: 80.6411, type: "historical", description: "Tiny Hindu-Buddhist stone temple — unusual hybrid architecture, in the middle of a tank. Skip-if-rushed.", interests: ["history"], duration: "30 min" },
    ],
    tips: [
      "Climb Sigiriya at sunrise (gates 5am) — much cooler, half the crowd, best photo light.",
      "Pidurangala has BETTER photos of Sigiriya than the climb itself.",
      "Buy spices direct from the gardens — half the airport price.",
    ],
  },
  {
    slug: "nuwara-eliya",
    name: "Nuwara Eliya",
    province: "Central Province",
    shortTagline: "Little England — tea estates, cool air, Horton Plains.",
    intro: "Nuwara Eliya sits at 1,900m and feels like a transplanted English hill town — cool nights, Tudor architecture, manicured tea estates rolling away on every side. Two days covers the town, a tea factory tour and the World's End hike at Horton Plains.",
    bestTime: "February to April (cool, clear); July is rainy",
    budgetUSDPerDay: { low: 35, high: 130 },
    hero: wikipediaPhoto("Nuwara_Eliya", "5/5b/Sri_Lanka_-_Nuwara_Eliya_-_001_-_Tea_picker.jpg", "Tea picker in Nuwara Eliya"),
    places: [
      { name: "Gregory Lake", lat: 6.9544, lng: 80.7886, type: "viewpoint", description: "Town's central lake — paddle boats, ponies, joggers. Nice for a slow late afternoon, cold by 5pm.", interests: ["nature", "family-friendly"], duration: "1-1.5 hours" },
      { name: "Pedro Tea Estate", lat: 6.9420, lng: 80.8121, type: "garden", description: "Working tea estate with 30-min factory tour — withering, rolling, fermenting. End in the tasting room.", interests: ["tea", "nature", "culture"], duration: "1.5 hours" },
      { name: "Hakgala Botanical Gardens", lat: 6.9281, lng: 80.8156, type: "garden", description: "High-altitude gardens with roses, ferns and a moss-covered Japanese garden. Cool, often misty mornings.", interests: ["nature", "photography", "family-friendly"], duration: "1.5-2 hours" },
      { name: "Horton Plains National Park", lat: 6.8086, lng: 80.7975, type: "nature", description: "9km loop trail to World's End escarpment (200m sheer drop) and Baker's Falls. Start at 6am — cloud cover by 10am.", interests: ["hiking", "nature", "adventure", "photography"], duration: "5-6 hours" },
      { name: "Lover's Leap Waterfall", lat: 6.9858, lng: 80.7989, type: "waterfall", description: "Short walk through a tea estate to a 30m waterfall — quieter than the famous south-coast falls.", interests: ["nature", "hiking"], duration: "1.5 hours" },
      { name: "Victoria Park", lat: 6.9706, lng: 80.7700, type: "garden", description: "Town's central park, with a small zoo, playground, and resident endemic birds in winter.", interests: ["nature", "family-friendly"], duration: "1 hour" },
    ],
    tips: [
      "Nights drop to 8–12°C — pack warm layers (most guesthouses have no heating).",
      "Horton Plains: leave Nuwara Eliya by 5am for the 6am gate opening. Misty after 9am.",
      "Train Kandy → Nanu Oya (Nuwara Eliya station) is the scenic classic — book second class reserved.",
    ],
  },

  // ─── SOUTHERN PROVINCE ──────────────────────────────────────────────
  {
    slug: "galle",
    name: "Galle",
    province: "Southern Province",
    shortTagline: "Dutch fort by the sea — UNESCO, beaches, boutique hotels.",
    intro: "Galle is the south coast's old colonial port — a walled Dutch fort jutting into the Indian Ocean, narrow lanes of boutique shops and restaurants, and a string of beaches to the east. Two days covers the fort and Unawatuna; three lets you add Mirissa.",
    bestTime: "December to March",
    budgetUSDPerDay: { low: 40, high: 130 },
    hero: wikipediaPhoto("Galle", "thumb/7/79/Galle_Aerial_View.jpg/1280px-Galle_Aerial_View.jpg", "Galle Fort aerial view"),
    places: [
      { name: "Galle Fort (ramparts)", lat: 6.0273, lng: 80.2177, type: "fort", description: "UNESCO World Heritage. Walk the 3km wall — start at the Old Gate, end at the lighthouse. Pack water.", interests: ["history", "photography", "culture"], duration: "1.5 hours" },
      { name: "Galle Lighthouse", lat: 6.0244, lng: 80.2181, type: "historical", description: "Sri Lanka's oldest, on the southern tip of the ramparts. Photogenic at any hour, packed at sunset.", interests: ["photography", "history"], duration: "30 min" },
      { name: "Dutch Reformed Church", lat: 6.0259, lng: 80.2173, type: "historical", description: "Built 1755, one of the oldest Protestant churches in Sri Lanka. Tombstone floor is the unusual feature.", interests: ["history", "culture"], duration: "15 min" },
      { name: "Unawatuna Beach", lat: 6.0105, lng: 80.2502, type: "beach", description: "Calm reef-protected bay 20 min east of Galle — the most beginner-friendly swim on the south coast.", interests: ["beaches", "family-friendly"], duration: "2-3 hours" },
      { name: "Jungle Beach", lat: 6.0131, lng: 80.2324, type: "beach", description: "Small cove on the next headland west — 15-min walk through forest. Good snorkelling.", interests: ["beaches", "adventure", "nature"], duration: "1.5 hours" },
      { name: "Maritime Archaeology Museum", lat: 6.0263, lng: 80.2186, type: "museum", description: "Dutch and Portuguese shipwreck exhibits, inside the fort walls. Easy 1-hour pairing with the ramparts walk.", interests: ["history", "culture"], duration: "1 hour" },
      { name: "Japanese Peace Pagoda", lat: 6.0110, lng: 80.2438, type: "temple", description: "Whitewashed pagoda on the hill above Jungle Beach. Sweeping views back to the fort.", interests: ["culture", "viewpoint", "photography"], duration: "45 min" },
    ],
    tips: [
      "Stay inside the fort if budget allows — boutique hotels in cobbled lanes, magical after day-trippers leave.",
      "Walk the ramparts before 9am or after 4pm for photos without crowds.",
      "Southern Expressway from Colombo is 2-2.5 hours by car.",
    ],
  },
  {
    slug: "matara",
    name: "Matara",
    province: "Southern Province",
    shortTagline: "Mirissa whale watching, Coconut Tree Hill, surf at Weligama.",
    intro: "Matara district covers the southernmost coast — Weligama for beginner surf, Mirissa for the blue-whale boats and the iconic Coconut Tree Hill, Polhena for a reef shallow enough to walk over. Two to three days is plenty.",
    bestTime: "November to April",
    budgetUSDPerDay: { low: 25, high: 90 },
    hero: wikipediaPhoto("Mirissa", "a/a5/Mirissa-Plage_%283%29.jpg", "Mirissa Beach"),
    places: [
      { name: "Mirissa Beach", lat: 5.9444, lng: 80.4566, type: "beach", description: "Crescent-shaped bay backed by coconut palms — beach bars, surfable break at one end, swimmable in the middle.", interests: ["beaches", "nightlife", "food"], duration: "3-4 hours" },
      { name: "Coconut Tree Hill", lat: 5.9492, lng: 80.4567, type: "viewpoint", description: "Photogenic grassy headland with leaning palm trees above the sea. Go an hour before sunset; small fee at the path.", interests: ["photography", "nature"], duration: "30 min" },
      { name: "Mirissa Whale Watching", lat: 5.9442, lng: 80.4528, type: "wildlife", description: "Boats leave at 6:30am Nov–April for blue whales. Pick an operator with marine biologists; cheap operators chase the whales.", interests: ["nature", "wildlife", "adventure"], duration: "3-4 hours" },
      { name: "Weligama Beach (surf)", lat: 5.9750, lng: 80.4297, type: "beach", description: "Long shallow beach with gentle wave — Sri Lanka's #1 beginner surf spot. Boards rent for ~$5/hour.", interests: ["beaches", "adventure"], duration: "2-3 hours" },
      { name: "Parrot Rock", lat: 5.9437, lng: 80.4569, type: "viewpoint", description: "Small rocky islet at Mirissa's centre, reachable on foot at low tide. Climb for a view over the whole bay.", interests: ["nature", "adventure"], duration: "30 min" },
      { name: "Polhena Reef", lat: 5.9404, lng: 80.5253, type: "nature", description: "Shallow reef you can walk to from Polhena Beach — see live coral and fish with just goggles. Bring water shoes.", interests: ["nature", "family-friendly", "beaches"], duration: "1.5 hours" },
      { name: "Star Fort, Matara", lat: 5.9483, lng: 80.5353, type: "fort", description: "Tiny 18th-century Dutch fort in town — six-pointed star plan, surrounded by a moat. Quick stop.", interests: ["history"], duration: "30 min" },
    ],
    tips: [
      "Whale watching: pick the dearer ethical operator — they don't chase, the wildlife stays.",
      "Weligama surf is best for absolute beginners; Hiriketiya is harder, Ahangama is for intermediates.",
      "Stilt fishermen photo spot is between Koggala and Weligama on the coast road.",
    ],
  },
  {
    slug: "hambantota",
    name: "Hambantota",
    province: "Southern Province",
    shortTagline: "Yala safari country, Tangalle beaches, Bundala flamingos.",
    intro: "Hambantota stretches along the far southern dry-zone coast — Yala for leopards, Bundala for water birds, Tangalle for empty beach kilometres. Two to three days covers Yala + one beach base.",
    bestTime: "February to July (dry season — best wildlife sightings)",
    budgetUSDPerDay: { low: 50, high: 200 },
    hero: wikipediaPhoto("Yala_National_Park", "8/8c/Sri_Lankan_Leopard_at_Yala_NP.jpg", "Sri Lankan leopard at Yala"),
    places: [
      { name: "Yala National Park (Block 1)", lat: 6.3676, lng: 81.5072, type: "wildlife", description: "World's densest leopard population. Half-day jeep safari leaves at 5:30am or 2:30pm. Block 5 is quieter.", interests: ["wildlife", "nature", "adventure", "photography"], duration: "4-5 hours" },
      { name: "Bundala National Park", lat: 6.1944, lng: 81.2231, type: "wildlife", description: "Coastal lagoons — flamingos, painted storks, crocodiles. Less hyped than Yala, often better birds.", interests: ["wildlife", "nature", "photography"], duration: "3-4 hours" },
      { name: "Tangalle Beach", lat: 6.0247, lng: 80.7944, type: "beach", description: "Wide stretch of pale sand, big swell. Swim only where there's a guard flag — strong rip currents.", interests: ["beaches"], duration: "3-4 hours" },
      { name: "Goyambokka Beach", lat: 6.0269, lng: 80.7757, type: "beach", description: "Small calm cove a few km west of Tangalle — protected by rocks, swimmable, much quieter.", interests: ["beaches", "family-friendly"], duration: "2-3 hours" },
      { name: "Mulkirigala Rock Temple", lat: 6.1631, lng: 80.7611, type: "temple", description: "Cave temple cut into a 200m rock — climb 500 steps for layered chambers and a top-platform view.", interests: ["history", "culture", "hiking"], duration: "2 hours" },
      { name: "Hummanaya Blow Hole", lat: 5.9700, lng: 80.6708, type: "nature", description: "Second-largest natural blowhole in the world — shoots a jet of seawater 25m high. Best at high tide with swell.", interests: ["nature", "photography"], duration: "30 min" },
    ],
    tips: [
      "Book Yala safaris through your guesthouse — quality varies wildly; ask for an experienced tracker.",
      "Yala closes Sep–Oct for ecosystem recovery; check before locking dates.",
      "Tangalle swim spots vary by season — local advice matters; don't trust empty-beach intuition.",
    ],
  },

  // ─── NORTHERN PROVINCE ─────────────────────────────────────────────
  {
    slug: "jaffna",
    name: "Jaffna",
    province: "Northern Province",
    shortTagline: "Tamil heartland — temple food, palmyra palms, island causeways.",
    intro: "Jaffna feels distinctly its own country — a Tamil cultural centre, recovering from war, with food, temples, and a slower pace very different from the south. Three to four days covers the city, an island day trip, and one or two coastal temples.",
    bestTime: "May to September (dry; the north has the opposite season to the south)",
    budgetUSDPerDay: { low: 25, high: 75 },
    hero: wikipediaPhoto("Nallur_Kandaswamy_temple", "0/03/Nallur_Kandaswamy_temple.JPG", "Nallur Kandaswamy temple"),
    places: [
      { name: "Nallur Kandaswamy Temple", lat: 9.6755, lng: 80.0258, type: "temple", description: "Most important Hindu temple in the north — gopuram, sacred pool, the August festival. Men shirt-off, women covered.", interests: ["culture", "history", "photography"], duration: "1.5 hours" },
      { name: "Jaffna Fort", lat: 9.6586, lng: 80.0078, type: "fort", description: "Dutch-built ramparts on a lagoon promontory. Walk the walls at sunset; the on-site museum is small but well-curated.", interests: ["history", "photography"], duration: "1.5 hours" },
      { name: "Casuarina Beach", lat: 9.7997, lng: 79.9117, type: "beach", description: "On Karainagar island — shallow, golden sand, very few tourists. Best in the morning before wind.", interests: ["beaches", "family-friendly"], duration: "2-3 hours" },
      { name: "Keerimalai Pond", lat: 9.8056, lng: 80.0117, type: "culture", description: "Spring-fed pool by the sea — sacred Hindu bathing spot; the saltwater backdrop is striking.", interests: ["culture", "history", "photography"], duration: "45 min" },
      { name: "Delft Island", lat: 9.5333, lng: 79.7000, type: "nature", description: "Ferry from Kurikadduwan jetty (1 hour) — wild ponies, baobab tree, Portuguese fort ruins. Day trip.", interests: ["nature", "history", "adventure"], duration: "5-6 hours" },
      { name: "Jaffna Library", lat: 9.6611, lng: 80.0203, type: "historical", description: "Rebuilt after the 1981 burning — a powerful symbol. Read the in-house exhibition before entering the reading rooms.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Point Pedro", lat: 9.8167, lng: 80.2333, type: "viewpoint", description: "Sri Lanka's northernmost point — lighthouse, beach, end-of-island feel.", interests: ["photography"], duration: "1 hour" },
    ],
    tips: [
      "Eat at Cosy Restaurant or Mangos for genuine northern Tamil food — crab curry and string hoppers.",
      "Train Colombo → Jaffna is 9 hours and scenic — overnight sleeper available.",
      "Pace is slow; many places close early. Plan around the heat.",
    ],
  },
  {
    slug: "kilinochchi",
    name: "Kilinochchi",
    province: "Northern Province",
    shortTagline: "Quiet rural district, sombre war-memorial stops.",
    intro: "Kilinochchi was the LTTE administrative centre during the civil war. It's now a rural farming district most travellers pass through; the war memorial and a couple of tanks are the main stops.",
    bestTime: "May to September",
    budgetUSDPerDay: { low: 20, high: 60 },
    hero: wikipediaPhoto("Kilinochchi_District", "b/bd/Iranamadu_Tank.jpg", "Iranamadu Tank"),
    places: [
      { name: "Kilinochchi War Memorial", lat: 9.3953, lng: 80.4042, type: "historical", description: "Concrete cube pierced by a giant lotus flower — government memorial commemorating the end of the war.", interests: ["history"], duration: "30 min" },
      { name: "Iranamadu Tank", lat: 9.3000, lng: 80.4500, type: "nature", description: "Largest reservoir in the north — birdlife on the bunds at dawn, irrigation channel walks.", interests: ["nature", "photography"], duration: "1 hour" },
      { name: "Murukandy Pillaiyar Temple", lat: 9.0500, lng: 80.4167, type: "temple", description: "Small Hindu roadside temple — drivers stop on the A9 route to ask Ganesha for a safe journey.", interests: ["culture"], duration: "20 min" },
    ],
    tips: [
      "Most travellers just pass through on the A9 to/from Jaffna.",
      "Limited accommodation — overnight in Vavuniya or Jaffna instead.",
    ],
  },
  {
    slug: "mannar",
    name: "Mannar",
    province: "Northern Province",
    shortTagline: "Adam's Bridge island, baobabs, sand dunes.",
    intro: "Mannar is an island connected by causeway, with the Adam's Bridge sandbank chain pointing toward India. Birdwatching is the unsung draw — flamingos, migrant waders. Two days is enough.",
    bestTime: "November to March (migrant bird season)",
    budgetUSDPerDay: { low: 25, high: 70 },
    hero: wikipediaPhoto("Mannar_District", "1/13/Mannar_Fort.jpg", "Mannar Fort"),
    places: [
      { name: "Mannar Fort", lat: 8.9810, lng: 79.9044, type: "fort", description: "Portuguese-then-Dutch fort at the causeway entrance — partly restored, sea-facing ramparts.", interests: ["history", "photography"], duration: "1 hour" },
      { name: "Baobab Tree (Pallimunai)", lat: 9.0167, lng: 79.8833, type: "nature", description: "700-year-old African baobab tree — Mannar has several but this one is the most accessible.", interests: ["nature", "photography"], duration: "30 min" },
      { name: "Adam's Bridge sandbar", lat: 9.1167, lng: 79.6333, type: "nature", description: "Chain of sand islands stretching toward India. Boat tours run from Talaimannar — windy, simple, atmospheric.", interests: ["nature", "adventure"], duration: "3-4 hours" },
      { name: "Talaimannar Lighthouse", lat: 9.0833, lng: 79.7333, type: "viewpoint", description: "Decommissioned lighthouse and the ferry-pier ruins — the closest point to India.", interests: ["photography", "history"], duration: "45 min" },
      { name: "Vankalai Sanctuary", lat: 8.9333, lng: 79.9333, type: "wildlife", description: "Coastal wetland with thousands of flamingos in winter, plus pelicans and storks. Best Nov–Feb at dawn.", interests: ["wildlife", "nature", "photography"], duration: "2 hours" },
    ],
    tips: [
      "Birdwatching is the killer activity — Nov–Feb only.",
      "Causeway gets very windy; secure hats and loose layers.",
    ],
  },
  {
    slug: "vavuniya",
    name: "Vavuniya",
    province: "Northern Province",
    shortTagline: "Transit district between south and Jaffna.",
    intro: "Vavuniya is mostly a transit hub on the A9 to Jaffna — useful for an overnight if you're train-hopping north, with one decent ancient site nearby.",
    bestTime: "May to September",
    budgetUSDPerDay: { low: 20, high: 60 },
    hero: wikipediaPhoto("Vavuniya", "thumb/3/35/A_view_of_Vavuniya_town.jpg/1280px-A_view_of_Vavuniya_town.jpg", "Vavuniya town"),
    places: [
      { name: "Madukanda Vihara", lat: 8.7500, lng: 80.5167, type: "temple", description: "Ancient Buddhist site — one of the early resting places of the Sacred Tooth Relic before Kandy. Quiet.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Kurumankadu Tank", lat: 8.7333, lng: 80.5333, type: "nature", description: "Town's main reservoir — bunds at dawn for migrant waterbirds in winter.", interests: ["nature", "photography"], duration: "45 min" },
      { name: "Vavuniya Archaeological Museum", lat: 8.7515, lng: 80.4974, type: "museum", description: "Small collection of north-central artefacts — pottery, coins, Hindu bronzes.", interests: ["history", "culture"], duration: "45 min" },
    ],
    tips: [
      "Better as a transit-night stop than a destination.",
    ],
  },
  {
    slug: "mullaitivu",
    name: "Mullaitivu",
    province: "Northern Province",
    shortTagline: "Coastal district recovering from the war — empty beaches, salt lagoons.",
    intro: "Mullaitivu's coastline is among the country's quietest — long beaches and salt lagoons, with few visitors. Tourism infrastructure is minimal. A day trip or quick overnight from Jaffna is enough.",
    bestTime: "May to September",
    budgetUSDPerDay: { low: 20, high: 60 },
    hero: wikipediaPhoto("Mullaitivu_District", "6/68/Mullaitivu_beach.jpg", "Mullaitivu beach"),
    places: [
      { name: "Mullaitivu Beach", lat: 9.2667, lng: 80.8167, type: "beach", description: "Wide empty coastline with no resorts — you'll usually be alone. Strong currents; don't swim deep.", interests: ["beaches", "photography"], duration: "2 hours" },
      { name: "Nayaru Lagoon", lat: 9.0833, lng: 80.9000, type: "nature", description: "Calm tidal lagoon — kayaking and birdwatching, with a few small guesthouses.", interests: ["nature", "adventure", "photography"], duration: "2 hours" },
    ],
    tips: [
      "Bring everything — restaurant options are sparse outside town.",
    ],
  },

  // ─── EASTERN PROVINCE ─────────────────────────────────────────────
  {
    slug: "batticaloa",
    name: "Batticaloa",
    province: "Eastern Province",
    shortTagline: "Lagoon town with a Dutch fort and singing fish.",
    intro: "Batticaloa is one of the country's oldest port cities — Dutch and Portuguese forts, the famous lagoon (and its 'singing fish' folklore), and Pasikuda beach an hour north for swimming.",
    bestTime: "April to September",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Batticaloa", "a/a5/Batticaloa_lagoon.jpg", "Batticaloa lagoon"),
    places: [
      { name: "Batticaloa Fort", lat: 7.7170, lng: 81.6996, type: "fort", description: "1628 Portuguese-then-Dutch fort on a lagoon island. Walk the ramparts at sunset.", interests: ["history", "photography"], duration: "1 hour" },
      { name: "Kallady Bridge", lat: 7.7167, lng: 81.7167, type: "viewpoint", description: "Sit at the rail and listen — locals say the 'singing fish' under the bridge hum on calm nights.", interests: ["culture"], duration: "30 min" },
      { name: "Pasikuda Beach", lat: 7.9333, lng: 81.5667, type: "beach", description: "Shallow protected bay — wade out 200m and water is still chest-deep. Resort strip behind the dunes.", interests: ["beaches", "family-friendly"], duration: "3-4 hours" },
      { name: "Kallady Lighthouse", lat: 7.7167, lng: 81.7000, type: "historical", description: "Compact red-and-white lighthouse on the lagoon shore — sunrise photo spot.", interests: ["photography"], duration: "30 min" },
      { name: "Batticaloa Gate (Old Town)", lat: 7.7167, lng: 81.6833, type: "historical", description: "Wander the old streets behind the fort — colonial-era timber buildings, mosques, churches.", interests: ["history", "culture"], duration: "1 hour" },
    ],
    tips: [
      "Pasikuda is best Apr–Sep — west coast is rough then, east coast is calm.",
      "Try cadju (cashew) curry at one of the lagoon-side restaurants.",
    ],
  },
  {
    slug: "ampara",
    name: "Ampara",
    province: "Eastern Province",
    shortTagline: "Arugam Bay surf, Lahugala elephants, the ancient east.",
    intro: "Ampara's main draw is Arugam Bay — the country's top surf destination, with a mellow village strip behind the break. Lahugala National Park inland is a quieter elephant-watching alternative to Yala.",
    bestTime: "April to September (surf season)",
    budgetUSDPerDay: { low: 30, high: 90 },
    hero: wikipediaPhoto("Arugam_Bay", "a/a9/Arugam_bay.jpg", "Arugam Bay"),
    places: [
      { name: "Arugam Bay Beach", lat: 6.8412, lng: 81.8364, type: "beach", description: "Long crescent surf beach — beginner waves at the south point, advanced at Main Point. Boards rent for ~$5/hour.", interests: ["beaches", "adventure", "nightlife"], duration: "3-4 hours" },
      { name: "Main Point (surf)", lat: 6.8444, lng: 81.8333, type: "adventure", description: "World-class right-hand point break — only consistent in surf season. Beginners watch from the rocks.", interests: ["adventure"], duration: "2-3 hours" },
      { name: "Lahugala National Park", lat: 6.9333, lng: 81.7167, type: "wildlife", description: "Small park with reliable elephant sightings — much less touristed than Yala. Half-day jeep tours.", interests: ["wildlife", "nature", "adventure"], duration: "3-4 hours" },
      { name: "Magul Maha Viharaya", lat: 6.7833, lng: 81.7667, type: "temple", description: "Forest monastery ruins — moonstone, dagobas, occasional wild elephants in the temple grounds at dusk.", interests: ["history", "wildlife"], duration: "1.5 hours" },
      { name: "Pottuvil Lagoon", lat: 6.8744, lng: 81.8261, type: "nature", description: "Mangrove safari at dawn — crocodiles, elephants on the bank, water birds. 1.5-hour boat ride.", interests: ["nature", "wildlife", "photography"], duration: "2 hours" },
    ],
    tips: [
      "Arugam Bay is a SEASONAL spot — empty Nov–Mar, busy May–Oct.",
      "Surf lessons run $20–35; pick an instructor with proper insurance.",
    ],
  },
  {
    slug: "trincomalee",
    name: "Trincomalee",
    province: "Eastern Province",
    shortTagline: "Natural harbour, Pigeon Island reef, Nilaveli beach.",
    intro: "Trincomalee has one of the world's great natural harbours, a famous Hindu temple on a cliff above the sea, and 30km of beaches stretching north past Nilaveli to Pigeon Island. Three days easily fills.",
    bestTime: "May to September",
    budgetUSDPerDay: { low: 30, high: 100 },
    hero: wikipediaPhoto("Trincomalee", "1/13/Koneswaram-temple-trincomalee.jpg", "Koneswaram temple at Trincomalee"),
    places: [
      { name: "Koneswaram Temple", lat: 8.5833, lng: 81.2483, type: "temple", description: "Hindu temple on Swami Rock, a sheer-cliff promontory above the harbour. The sunset view is the icon.", interests: ["culture", "photography", "history"], duration: "1.5 hours" },
      { name: "Fort Frederick", lat: 8.5820, lng: 81.2450, type: "fort", description: "Portuguese/Dutch/British fort still partly used by the military — walk through to reach Koneswaram.", interests: ["history"], duration: "45 min" },
      { name: "Nilaveli Beach", lat: 8.7000, lng: 81.1833, type: "beach", description: "Wide, calm, white-sand beach 15 km north of Trinco. Less developed than Pasikuda — quieter, swimmable.", interests: ["beaches", "family-friendly"], duration: "3-4 hours" },
      { name: "Pigeon Island National Park", lat: 8.7167, lng: 81.2000, type: "wildlife", description: "Snorkel reef 10 min boat from Nilaveli — corals, parrotfish, the occasional reef shark. Bring own snorkel.", interests: ["nature", "adventure", "family-friendly"], duration: "3-4 hours" },
      { name: "Marble Beach", lat: 8.5667, lng: 81.2167, type: "beach", description: "Sheltered cove south of Trinco — military-run beach, quiet, with paid entry. Calmest swim in the area.", interests: ["beaches", "family-friendly"], duration: "2-3 hours" },
      { name: "Whale Watching, Trincomalee", lat: 8.6000, lng: 81.2500, type: "wildlife", description: "Boats run May–Aug for blue whales — opposite season to Mirissa, often less crowded.", interests: ["wildlife", "adventure"], duration: "3-4 hours" },
    ],
    tips: [
      "East coast season is May–Sep — opposite of the south. Plan accordingly.",
      "Pigeon Island snorkel before 10am — water gets choppy and the boats churn the surface.",
    ],
  },

  // ─── NORTH WESTERN ──────────────────────────────────────────────
  {
    slug: "kurunegala",
    name: "Kurunegala",
    province: "North Western Province",
    shortTagline: "Coconut triangle, Yapahuwa rock fortress, easy stopover.",
    intro: "Kurunegala is the bus-junction of the country — most travellers pass through. The town itself has Elephant Rock and a lake; nearby Yapahuwa is a worthy lesser-known ancient capital.",
    bestTime: "January to April",
    budgetUSDPerDay: { low: 25, high: 65 },
    hero: wikipediaPhoto("Yapahuwa", "9/9c/Yapahuwa.jpg", "Yapahuwa rock fortress"),
    places: [
      { name: "Yapahuwa Rock Fortress", lat: 7.8167, lng: 80.2833, type: "historical", description: "Brief 13th-century royal capital — ornate stone staircase up the rock, lion-paw doorway like Sigiriya's.", interests: ["history", "hiking", "photography"], duration: "2 hours" },
      { name: "Athugala (Elephant Rock)", lat: 7.4886, lng: 80.3678, type: "viewpoint", description: "200m rock dominating Kurunegala town — climb the steps for a panorama of the lake and surrounding paddy.", interests: ["hiking", "viewpoint", "photography"], duration: "1.5 hours" },
      { name: "Ridi Vihara", lat: 7.6000, lng: 80.4333, type: "temple", description: "Cave temple where silver was discovered for the Ruwanwelisaya — Kandyan-era murals, brass Buddhas.", interests: ["history", "culture"], duration: "1 hour" },
      { name: "Kurunegala Lake", lat: 7.4833, lng: 80.3667, type: "viewpoint", description: "Town's central reservoir — sunset walk along the bund.", interests: ["nature"], duration: "45 min" },
      { name: "Panduwasnuwara", lat: 7.6667, lng: 80.0167, type: "historical", description: "11th-century royal city ruins — quieter and less-restored than the famous triangle sites.", interests: ["history"], duration: "1 hour" },
    ],
    tips: [
      "Often used as a stop-over between Colombo and the Cultural Triangle.",
    ],
  },
  {
    slug: "puttalam",
    name: "Puttalam",
    province: "North Western Province",
    shortTagline: "Wilpattu safari, Kalpitiya kitesurfing, dolphin coast.",
    intro: "Puttalam covers the north-west coast — Wilpattu (older and quieter than Yala for safari), Kalpitiya peninsula (kitesurfing, dolphin watching), and the salt-pan dry zone inland. Two days for safari + one beach day.",
    bestTime: "May to September (Kalpitiya), Feb-Sept (Wilpattu)",
    budgetUSDPerDay: { low: 35, high: 120 },
    hero: wikipediaPhoto("Wilpattu_National_Park", "thumb/8/82/Wilpattu_lake.jpg/1280px-Wilpattu_lake.jpg", "Wilpattu lake"),
    places: [
      { name: "Wilpattu National Park", lat: 8.4500, lng: 80.0333, type: "wildlife", description: "Country's biggest park — leopards, sloth bears, peacocks. 'Villu' lakes are the unique feature. Fewer jeeps than Yala.", interests: ["wildlife", "nature", "adventure"], duration: "4-6 hours" },
      { name: "Kalpitiya Beach", lat: 8.2333, lng: 79.7500, type: "beach", description: "Long flat peninsula beach — calm lagoon side for kitesurfing, choppier ocean side for surf.", interests: ["beaches", "adventure"], duration: "3-4 hours" },
      { name: "Dolphin Watching, Kalpitiya", lat: 8.2500, lng: 79.7500, type: "wildlife", description: "Boats leave at 6am Nov–April — sometimes hundreds of spinner dolphins in a single pod.", interests: ["wildlife", "nature", "photography"], duration: "3-4 hours" },
      { name: "Munneswaram Temple", lat: 7.7167, lng: 79.8333, type: "temple", description: "Major Hindu temple complex — five shrines, one of the oldest active temples in the country.", interests: ["culture", "history"], duration: "1 hour" },
      { name: "Bar Reef Marine Sanctuary", lat: 8.3167, lng: 79.5500, type: "nature", description: "Snorkel/dive reef off Kalpitiya — best visibility April–May. Boat day-trips run from the lagoon side.", interests: ["nature", "adventure"], duration: "5-6 hours" },
    ],
    tips: [
      "Wilpattu is bigger and quieter than Yala — better odds of solo sightings.",
      "Kalpitiya kitesurfing wind season is May–Sept; lessons run from beginner camps.",
    ],
  },

  // ─── NORTH CENTRAL ──────────────────────────────────────────────
  {
    slug: "anuradhapura",
    name: "Anuradhapura",
    province: "North Central Province",
    shortTagline: "Ancient capital — Ruwanwelisaya, the sacred Bo tree, 2000 years of ruins.",
    intro: "Anuradhapura was Sri Lanka's capital for 1,400 years and still holds the country's most-venerated Buddhist sites — the Sacred Bo Tree grown from a cutting brought from India in 288 BC, plus enormous white stupas and a vast monastery complex. Two days minimum.",
    bestTime: "February to April",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Anuradhapura", "6/65/Ruwanweli_Maha_Saaya.jpg", "Ruwanwelisaya stupa"),
    places: [
      { name: "Ruwanwelisaya", lat: 8.3500, lng: 80.3961, type: "temple", description: "Vast 2nd-century BC white stupa — over 100m tall when built; one of the great religious monuments of the world.", interests: ["history", "culture", "photography"], duration: "1.5 hours" },
      { name: "Jaya Sri Maha Bodhi", lat: 8.3447, lng: 80.3964, type: "temple", description: "Sacred Bo Tree, grown from a cutting of the original tree under which the Buddha attained enlightenment. Oldest documented tree in the world.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Jetavanaramaya", lat: 8.3525, lng: 80.4022, type: "historical", description: "World's third-tallest brick structure when built (3rd century). The brick mountain still rises 70m.", interests: ["history", "photography"], duration: "1 hour" },
      { name: "Abhayagiri Vihara", lat: 8.3633, lng: 80.3964, type: "historical", description: "Sprawling monastic city with stupa, bathing tanks and the moonstone-decorated entrance steps. Quieter than the centre.", interests: ["history", "culture"], duration: "1.5 hours" },
      { name: "Mihintale", lat: 8.3528, lng: 80.5097, type: "temple", description: "Where Buddhism was introduced to Sri Lanka in 247 BC. 1840 stone steps up, panoramic dagoba and meditation cells.", interests: ["history", "hiking", "culture"], duration: "2-3 hours" },
      { name: "Isurumuniya Vihara", lat: 8.3328, lng: 80.3961, type: "temple", description: "Small rock temple with the famous 'lovers' carving — cooling pool, big-rock interior.", interests: ["history", "culture"], duration: "45 min" },
      { name: "Thuparamaya", lat: 8.3553, lng: 80.3942, type: "temple", description: "Oldest stupa in Sri Lanka (3rd century BC) — contains a collarbone of the Buddha. Smaller than Ruwanwelisaya.", interests: ["history", "culture"], duration: "30 min" },
    ],
    tips: [
      "Buy the 'Cultural Triangle' ticket if also visiting Polonnaruwa and Sigiriya — cheaper than separate.",
      "Bicycle is the perfect way to see Anuradhapura — flat, 5-7 km between sites.",
      "Cover shoulders + knees at every site; remove hats and shoes at stupas.",
    ],
  },
  {
    slug: "polonnaruwa",
    name: "Polonnaruwa",
    province: "North Central Province",
    shortTagline: "Medieval capital — Gal Vihara Buddhas, royal palace, royal lake.",
    intro: "Polonnaruwa was Sri Lanka's capital from the 11th–13th century after Anuradhapura fell. The ruins are more compact and arguably more photogenic — Gal Vihara's rock-carved Buddhas are the icon. A day to a day and a half.",
    bestTime: "February to April",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Polonnaruwa", "thumb/0/0c/Gal_Vihara.jpg/1280px-Gal_Vihara.jpg", "Gal Vihara"),
    places: [
      { name: "Gal Vihara", lat: 7.9667, lng: 81.0000, type: "historical", description: "Four 12th-century Buddhas carved from a single granite face — the standing one is 7m tall. Highlight of the site.", interests: ["history", "culture", "photography"], duration: "1 hour" },
      { name: "Royal Palace (Parakramabahu)", lat: 7.9417, lng: 81.0011, type: "historical", description: "Ruins of the 12th-century royal palace — 50-room layout still visible, thick brick walls.", interests: ["history"], duration: "1 hour" },
      { name: "Polonnaruwa Vatadage", lat: 7.9472, lng: 81.0058, type: "historical", description: "Circular relic house — beautifully preserved stone columns, four Buddha statues facing the cardinal directions.", interests: ["history", "photography"], duration: "1 hour" },
      { name: "Rankoth Vehera", lat: 7.9667, lng: 81.0083, type: "temple", description: "Largest stupa in Polonnaruwa — looks like a small Ruwanwelisaya. Calm setting under big trees.", interests: ["history"], duration: "30 min" },
      { name: "Parakrama Samudra", lat: 7.9333, lng: 80.9833, type: "viewpoint", description: "Enormous 12th-century reservoir — sunset bund walk with fishermen and herons.", interests: ["nature", "photography"], duration: "45 min" },
      { name: "Lankathilaka Image House", lat: 7.9583, lng: 81.0042, type: "historical", description: "Three-storey brick image house — towering Buddha statue, ornate brick walls. Photogenic.", interests: ["history", "photography"], duration: "30 min" },
    ],
    tips: [
      "Hire a bicycle at the entrance — the ruins span 4 km; cycling is faster than walking.",
      "Visit Gal Vihara early; tour buses arrive ~10am.",
    ],
  },

  // ─── UVA PROVINCE ──────────────────────────────────────────────
  {
    slug: "badulla",
    name: "Badulla",
    province: "Uva Province",
    shortTagline: "Ella, Nine Arches Bridge, the scenic-train heartland.",
    intro: "Badulla district contains the country's most-Instagrammed hill town (Ella) plus the train route through tea country and several big waterfalls. Three to four days minimum for Ella + Haputale + Bandarawela.",
    bestTime: "January to March",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Ella,_Sri_Lanka", "thumb/0/0c/Nine_Arch_Bridge_with_train.jpg/1280px-Nine_Arch_Bridge_with_train.jpg", "Nine Arches Bridge"),
    places: [
      { name: "Nine Arches Bridge, Ella", lat: 6.8755, lng: 81.0601, type: "historical", description: "Iconic curved colonial railway viaduct in tea country. Trains cross ~6 times/day; best photos at 9:30am.", interests: ["photography", "history", "nature"], duration: "1.5 hours" },
      { name: "Little Adam's Peak", lat: 6.8519, lng: 81.0635, type: "viewpoint", description: "Easiest hill-country hike — 45 min up, 360° summit at 1141 m. Best at sunrise.", interests: ["hiking", "photography", "viewpoint"], duration: "2 hours" },
      { name: "Ella Rock", lat: 6.8639, lng: 81.0440, type: "adventure", description: "Harder 3-4 hour hike; navigation-tricky on the railway track section. Hire a local guide.", interests: ["hiking", "adventure", "nature"], duration: "4 hours" },
      { name: "Diyaluma Falls", lat: 6.7333, lng: 81.0500, type: "waterfall", description: "Second-tallest waterfall in Sri Lanka (220 m) — natural pools at the top after a short scramble.", interests: ["nature", "adventure", "photography"], duration: "3 hours" },
      { name: "Ravana Falls", lat: 6.8406, lng: 81.0453, type: "waterfall", description: "25 m waterfall right on the main road, 6 km south of Ella. Skip swimming — slippery rocks.", interests: ["nature"], duration: "30 min" },
      { name: "Lipton's Seat", lat: 6.7359, lng: 80.9426, type: "viewpoint", description: "Sir Thomas Lipton's lookout in Haputale — sunrise view over seven provinces on clear days.", interests: ["tea", "viewpoint", "photography"], duration: "3-4 hours" },
      { name: "Dambatenne Tea Factory", lat: 6.7681, lng: 80.9431, type: "garden", description: "Original 1890 Lipton factory — 30-min guided tour, single-estate tea to buy. Pair with Lipton's Seat.", interests: ["tea", "culture"], duration: "1 hour" },
      { name: "Dunhinda Falls", lat: 6.9831, lng: 81.1031, type: "waterfall", description: "63 m waterfall near Badulla town — 15-min walk in. Heavy flow after monsoon.", interests: ["nature", "photography"], duration: "1.5 hours" },
    ],
    tips: [
      "Book the train Kandy→Ella in reserved second class at least 30 days ahead.",
      "Pack warm — Ella nights drop to 12–15°C in January.",
      "Phone signal is spotty on the hikes — download offline maps.",
    ],
  },
  {
    slug: "monaragala",
    name: "Monaragala",
    province: "Uva Province",
    shortTagline: "Sacred Kataragama, eastern Yala access, ancient ruins.",
    intro: "Monaragala is hot dry country in the south-east — the sacred multi-faith pilgrimage town of Kataragama is the headline, plus the Yala east entrance and a few lesser-known archaeological sites.",
    bestTime: "May to September",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Kataragama_temple", "0/04/Kataragama_temple.jpg", "Kataragama temple"),
    places: [
      { name: "Kataragama Temple Complex", lat: 6.4156, lng: 81.3344, type: "temple", description: "Major pilgrimage site shared by Buddhists, Hindus and Muslims — most-visited at the July full moon festival.", interests: ["culture", "history", "photography"], duration: "2-3 hours" },
      { name: "Maligawila Buddha", lat: 6.7333, lng: 81.4167, type: "historical", description: "10th-century 11 m standing limestone Buddha, hidden in a quiet forest clearing.", interests: ["history", "culture"], duration: "1 hour" },
      { name: "Buduruwagala", lat: 6.7833, lng: 81.2333, type: "historical", description: "Seven rock-cut Buddhas, including one 15m tall — pre-Mahayana, hidden in scrubland.", interests: ["history", "photography"], duration: "1.5 hours" },
      { name: "Yala East (Kumana) National Park", lat: 6.5667, lng: 81.6500, type: "wildlife", description: "Eastern adjacent of Yala — quieter, often more wildlife per vehicle. Closes part of the year.", interests: ["wildlife", "adventure", "nature"], duration: "4-5 hours" },
    ],
    tips: [
      "Time visits to avoid the July Kataragama festival unless you specifically want it — crowds peak then.",
    ],
  },

  // ─── SABARAGAMUWA ──────────────────────────────────────────────
  {
    slug: "ratnapura",
    name: "Ratnapura",
    province: "Sabaragamuwa Province",
    shortTagline: "Gem city, Sinharaja rainforest, hilltop temples.",
    intro: "Ratnapura ('city of gems') is the country's gem-trading capital and the gateway to Sinharaja, the last big primary rainforest. One day for the town, two for Sinharaja.",
    bestTime: "January to March",
    budgetUSDPerDay: { low: 25, high: 80 },
    hero: wikipediaPhoto("Ratnapura", "f/f8/Ratnapura_Clock_Tower.jpg", "Ratnapura Clock Tower"),
    places: [
      { name: "Maha Saman Devalaya", lat: 6.6889, lng: 80.3942, type: "temple", description: "16th-century hilltop temple dedicated to Saman, guardian deity of Sri Pada — Esala festival in July.", interests: ["culture", "history"], duration: "1 hour" },
      { name: "Ratnapura National Museum", lat: 6.6783, lng: 80.4042, type: "museum", description: "Gem collection, royal jewellery, prehistoric artefacts. Small but quirky.", interests: ["history", "culture"], duration: "1 hour" },
      { name: "Bopath Falls", lat: 6.7833, lng: 80.3000, type: "waterfall", description: "Distinctive bo-leaf-shaped waterfall — short walk in, basic local-food stalls at the entrance.", interests: ["nature", "photography"], duration: "1.5 hours" },
      { name: "Sinharaja Rainforest", lat: 6.4000, lng: 80.5000, type: "nature", description: "UNESCO primary rainforest — endemic birds, leopards rarely seen but present. Guided trails 2-6 hours.", interests: ["nature", "wildlife", "hiking", "photography"], duration: "5-6 hours" },
      { name: "Gem Mining Tour, Ratnapura", lat: 6.6783, lng: 80.4042, type: "culture", description: "Local guides show working alluvial gem pits — gravel-washing demonstration, polishing workshop visit.", interests: ["culture"], duration: "2 hours" },
    ],
    tips: [
      "Sinharaja is wet most of the year — pack leech socks and rain layers.",
      "Don't buy gems from the street touts — book a certified shop or you'll pay for glass.",
    ],
  },
  {
    slug: "kegalle",
    name: "Kegalle",
    province: "Sabaragamuwa Province",
    shortTagline: "Pinnawala elephants, Bible Rock, lush in-between hills.",
    intro: "Kegalle district sits between Colombo and Kandy — the famous Pinnawala Elephant Orphanage is the main draw, plus a few hill-country viewpoints often missed.",
    bestTime: "December to April",
    budgetUSDPerDay: { low: 25, high: 75 },
    hero: wikipediaPhoto("Pinnawala_Elephant_Orphanage", "9/9c/Pinnawala_elephant_in_the_river.jpg", "Pinnawala elephants in the river"),
    places: [
      { name: "Pinnawala Elephant Orphanage", lat: 7.3009, lng: 80.3884, type: "wildlife", description: "Government-run rescue — herd walks to the Maha Oya river at 10am and 2pm for the bath. Iconic.", interests: ["wildlife", "family-friendly", "photography"], duration: "2-3 hours" },
      { name: "Millennium Elephant Foundation", lat: 7.3034, lng: 80.3905, type: "wildlife", description: "Smaller foundation 1 km from Pinnawala — more direct interaction, fewer animals.", interests: ["wildlife", "family-friendly"], duration: "1.5 hours" },
      { name: "Bible Rock (Bathalegala)", lat: 7.1167, lng: 80.5500, type: "viewpoint", description: "Flat-topped rock visible from the Colombo-Kandy road — 3-hour hike to the summit, 360° hill view.", interests: ["hiking", "viewpoint", "adventure"], duration: "4 hours" },
      { name: "Belilena Cave", lat: 7.0667, lng: 80.4500, type: "historical", description: "Pre-historic cave shelter where 30,000-year-old Balangoda Man skeleton fragments were found.", interests: ["history", "nature"], duration: "1.5 hours" },
      { name: "Sapumalkanda Sri Lanka Tea Factory", lat: 7.2519, lng: 80.3464, type: "garden", description: "Small working tea factory — 30-min tour ending in a tasting room. Off the typical tourist trail.", interests: ["tea", "culture"], duration: "1 hour" },
    ],
    tips: [
      "Pinnawala river-bath times (10am and 2pm) are the only times you see the whole herd — plan around them.",
      "Bible Rock hike is hot — start at 6am.",
    ],
  },
];

export function getDistrictBySlug(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}
