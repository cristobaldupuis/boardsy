export type Colorway = {
  id: string;
  name: string;
  swatch: string;
};

export type Pack = {
  qty: number;
  priceCents: number;
  label: string;
};

export type ProductKind = "boardopolis" | "cards" | "party";

export type StreetGroup = {
  id: string;
  label: string;
  color: string;
  count: number;
  examples: string[];
};

export type NameSet = {
  id: string;
  name: string;
  names: string[];
};

export type BoardopolisPreset = {
  id: string;
  name: string;
  streets: Record<string, string[]>;
  stationsId: string;
  utilitiesId: string;
};

export type Product = {
  slug: string;
  kind: ProductKind;
  name: string;
  tagline: string;
  priceFromCents: number;
  image: string;
  gallery: string[];
  packs: Pack[];
  colorways: Colorway[];
  presets: { id: string; name: string; spaces: string[] }[];
  photoSlots: number;
  includes: string[];
  leadTime: string;
};

export const PACKS_BOARD: Pack[] = [
  { qty: 1, priceCents: 15000, label: "1" },
  { qty: 2, priceCents: 27500, label: "2" },
  { qty: 3, priceCents: 37500, label: "3" },
];

export const STREET_GROUPS: StreetGroup[] = [
  {
    id: "brown",
    label: "Brown",
    color: "#6B3F24",
    count: 2,
    examples: ["Grandma's House", "Aunt Lucy's", "Uncle Joe's", "The Attic"],
  },
  {
    id: "sky",
    label: "Sky",
    color: "#7EB6D0",
    count: 3,
    examples: ["The Porch", "The Garden", "First Home", "The Apartment"],
  },
  {
    id: "pink",
    label: "Pink",
    color: "#D48AA8",
    count: 3,
    examples: ["Sunday Table", "Movie Nights", "The Dog's Chair", "The Kitchen"],
  },
  {
    id: "orange",
    label: "Orange",
    color: "#E07A3D",
    count: 3,
    examples: ["Snow Days", "Road Trips", "Hometown", "The Cabin"],
  },
  {
    id: "red",
    label: "Red",
    color: "#C44536",
    count: 3,
    examples: ["Birthdays", "Reunions", "School Run", "The Park"],
  },
  {
    id: "yellow",
    label: "Yellow",
    color: "#D4A017",
    count: 3,
    examples: ["Inside Jokes", "Traditions", "Late Night Talks", "Game Night"],
  },
  {
    id: "green",
    label: "Green",
    color: "#4A7C59",
    count: 3,
    examples: ["Adventures", "Celebrations", "Future Plans", "The Beach"],
  },
  {
    id: "navy",
    label: "Navy",
    color: "#2C3E6B",
    count: 2,
    examples: ["Memories", "Always Home", "Forever"],
  },
];

export const STATION_SETS: NameSet[] = [
  {
    id: "compass",
    name: "Compass",
    names: ["North Station", "East Station", "South Station", "West Station"],
  },
  {
    id: "travel",
    name: "Travel",
    names: ["The Airport", "The Train", "The Bus Depot", "The Ferry"],
  },
  {
    id: "family",
    name: "Family routes",
    names: ["School Run", "The Office", "Grandma's", "The Cabin"],
  },
  {
    id: "hangouts",
    name: "Hangouts",
    names: ["The Bar", "The Diner", "The Park", "Home"],
  },
  { id: "custom", name: "Write your own", names: ["", "", "", ""] },
];

export const UTILITY_SETS: NameSet[] = [
  {
    id: "civic",
    name: "Power & water",
    names: ["The Power Plant", "The Water Tower"],
  },
  {
    id: "home",
    name: "Home stuff",
    names: ["The Wi-Fi", "The Thermostat"],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    names: ["The Coffee Machine", "The Dishwasher"],
  },
  {
    id: "yard",
    name: "Yard",
    names: ["The Lawn Mower", "The Snow Blower"],
  },
  { id: "custom", name: "Write your own", names: ["", ""] },
];

export const BOARDOPOLIS_PRESETS: BoardopolisPreset[] = [
  {
    id: "family",
    name: "Family hometown",
    stationsId: "family",
    utilitiesId: "home",
    streets: {
      brown: ["Grandma's House", "Aunt Lucy's"],
      sky: ["The Porch", "The Garden", "First Home"],
      pink: ["Sunday Table", "Movie Nights", "The Dog's Chair"],
      orange: ["Snow Days", "Road Trips", "Hometown"],
      red: ["Birthdays", "Reunions", "School Run"],
      yellow: ["Inside Jokes", "Traditions", "Late Night Talks"],
      green: ["Adventures", "Celebrations", "Future Plans"],
      navy: ["Memories", "Always Home"],
    },
  },
  {
    id: "wedding",
    name: "Wedding",
    stationsId: "travel",
    utilitiesId: "kitchen",
    streets: {
      brown: ["First Date", "The Proposal"],
      sky: ["City Hall", "The Dance", "Vows"],
      pink: ["The Apartment", "Sunday Coffee", "Our Kitchen"],
      orange: ["Honeymoon", "Weekend Trips", "Rainy Taxis"],
      red: ["The Song", "The Rings", "In-Laws"],
      yellow: ["Shared Playlist", "New Traditions", "Letters"],
      green: ["Friends' Table", "The Afterparty", "Pets We Adopted"],
      navy: ["Home", "Forever"],
    },
  },
  {
    id: "friends",
    name: "Friends",
    stationsId: "hangouts",
    utilitiesId: "yard",
    streets: {
      brown: ["The Dive Bar", "The Couch"],
      sky: ["Group Chat", "Brunch", "Cheap Pizza"],
      pink: ["Karaoke", "The Apartment", "Game Night"],
      orange: ["Road Trip", "Camping Fail", "Airport Pickup"],
      red: ["Fantasy Draft", "That One Night", "Moving Day"],
      yellow: ["Inside Joke #7", "The Playlist", "Pet Sitting"],
      green: ["Reunion", "New Year's", "The Secret Spot"],
      navy: ["Call Me Later", "Always"],
    },
  },
];

export type BoardCell =
  | { kind: "corner"; id: string; label: string }
  | { kind: "tax"; id: string; label: string }
  | { kind: "draw"; id: string; label: string }
  | { kind: "street"; id: string; groupId: string; index: number }
  | { kind: "station"; id: string; index: number }
  | { kind: "utility"; id: string; index: number };

/** 40 spaces, clockwise from Start (bottom-right). Corners/tax/draw stay fixed. */
export const BOARD_CELLS: BoardCell[] = [
  { kind: "corner", id: "start", label: "Start" },
  { kind: "street", id: "s-brown-0", groupId: "brown", index: 0 },
  { kind: "draw", id: "draw-1", label: "Draw" },
  { kind: "street", id: "s-brown-1", groupId: "brown", index: 1 },
  { kind: "tax", id: "tax-1", label: "Tax" },
  { kind: "station", id: "st-0", index: 0 },
  { kind: "street", id: "s-sky-0", groupId: "sky", index: 0 },
  { kind: "draw", id: "draw-2", label: "Draw" },
  { kind: "street", id: "s-sky-1", groupId: "sky", index: 1 },
  { kind: "street", id: "s-sky-2", groupId: "sky", index: 2 },
  { kind: "corner", id: "timeout", label: "Time Out" },
  { kind: "street", id: "s-pink-0", groupId: "pink", index: 0 },
  { kind: "utility", id: "u-0", index: 0 },
  { kind: "street", id: "s-pink-1", groupId: "pink", index: 1 },
  { kind: "street", id: "s-pink-2", groupId: "pink", index: 2 },
  { kind: "station", id: "st-1", index: 1 },
  { kind: "street", id: "s-orange-0", groupId: "orange", index: 0 },
  { kind: "draw", id: "draw-3", label: "Draw" },
  { kind: "street", id: "s-orange-1", groupId: "orange", index: 1 },
  { kind: "street", id: "s-orange-2", groupId: "orange", index: 2 },
  { kind: "corner", id: "rest", label: "Rest" },
  { kind: "street", id: "s-red-0", groupId: "red", index: 0 },
  { kind: "draw", id: "draw-4", label: "Draw" },
  { kind: "street", id: "s-red-1", groupId: "red", index: 1 },
  { kind: "street", id: "s-red-2", groupId: "red", index: 2 },
  { kind: "station", id: "st-2", index: 2 },
  { kind: "street", id: "s-yellow-0", groupId: "yellow", index: 0 },
  { kind: "street", id: "s-yellow-1", groupId: "yellow", index: 1 },
  { kind: "utility", id: "u-1", index: 1 },
  { kind: "street", id: "s-yellow-2", groupId: "yellow", index: 2 },
  { kind: "corner", id: "skip", label: "Skip a Turn" },
  { kind: "street", id: "s-green-0", groupId: "green", index: 0 },
  { kind: "street", id: "s-green-1", groupId: "green", index: 1 },
  { kind: "draw", id: "draw-5", label: "Draw" },
  { kind: "street", id: "s-green-2", groupId: "green", index: 2 },
  { kind: "station", id: "st-3", index: 3 },
  { kind: "draw", id: "draw-6", label: "Draw" },
  { kind: "street", id: "s-navy-0", groupId: "navy", index: 0 },
  { kind: "tax", id: "tax-2", label: "Tax" },
  { kind: "street", id: "s-navy-1", groupId: "navy", index: 1 },
];

export function emptyStreets(): Record<string, string[]> {
  return Object.fromEntries(STREET_GROUPS.map((g) => [g.id, Array.from({ length: g.count }, () => "")]));
}

export function cloneStreets(src: Record<string, string[]>) {
  return Object.fromEntries(Object.entries(src).map(([k, v]) => [k, [...v]]));
}

export const PRODUCTS: Product[] = [
  {
    slug: "boardopolis",
    kind: "boardopolis",
    name: "Boardopolis",
    tagline: "The city game with your streets",
    priceFromCents: 15000,
    image: "/images/hero-boardopolis.jpg",
    gallery: ["/images/hero-boardopolis.jpg", "/images/board-top.jpg"],
    packs: PACKS_BOARD,
    colorways: [
      { id: "heritage", name: "Heritage", swatch: "#C45C26" },
      { id: "coastal", name: "Coastal", swatch: "#5B7A6A" },
    ],
    presets: BOARDOPOLIS_PRESETS.map((p) => ({ id: p.id, name: p.name, spaces: [] })),
    photoSlots: 4,
    includes: [
      "18\" folded board with your streets, stations, and utilities",
      "Rigid gift box",
      "Deed cards + event cards",
      "Play money, houses, dice, tokens",
      "Rules rewritten in plain language",
      "Proof emailed before we print",
    ],
    leadTime: "Made to order · typically 2–3 weeks",
  },
  {
    slug: "boardsycards",
    kind: "cards",
    name: "Boardsycards",
    tagline: "A deck that looks like you",
    priceFromCents: 4900,
    image: "/images/boardsycards.jpg",
    gallery: ["/images/boardsycards.jpg"],
    packs: [
      { qty: 1, priceCents: 4900, label: "1 deck" },
      { qty: 2, priceCents: 8800, label: "2 decks" },
      { qty: 3, priceCents: 12000, label: "3 decks" },
    ],
    colorways: [
      { id: "cream", name: "Cream", swatch: "#E8DFD2" },
      { id: "ink", name: "Ink", swatch: "#1C1917" },
    ],
    presets: [
      { id: "family", name: "Family faces", spaces: [] },
      { id: "wedding", name: "Wedding party", spaces: [] },
      { id: "pets", name: "Pets", spaces: [] },
    ],
    photoSlots: 4,
    includes: [
      "54 poker-size cards",
      "Custom tuck box with your title",
      "Photo court cards",
      "Proof emailed before we print",
    ],
    leadTime: "Made to order · typically 2–3 weeks",
  },
  {
    slug: "wilddeck",
    kind: "party",
    name: "Wilddeck",
    tagline: "A chaotic party deck about your group",
    priceFromCents: 5900,
    image: "/images/wilddeck.jpg",
    gallery: ["/images/wilddeck.jpg"],
    packs: [
      { qty: 1, priceCents: 5900, label: "1" },
      { qty: 2, priceCents: 10800, label: "2" },
      { qty: 3, priceCents: 15000, label: "3" },
    ],
    colorways: [
      { id: "rust", name: "Rust", swatch: "#C45C26" },
      { id: "night", name: "Night", swatch: "#2A2420" },
    ],
    presets: [
      { id: "kind", name: "Kind", spaces: [] },
      { id: "chaotic", name: "Chaotic", spaces: [] },
      { id: "family", name: "Family", spaces: [] },
    ],
    photoSlots: 6,
    includes: [
      "56 original party cards",
      "8 cards with your names / photos",
      "Tuck box",
      "Proof emailed before we print",
    ],
    leadTime: "Made to order · typically 2–3 weeks",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function extraCopyPrice(base: Pack, extraQty: number) {
  return base.priceCents + extraQty * 10000;
}

export function nameSetById(sets: NameSet[], id: string) {
  return sets.find((s) => s.id === id) ?? sets[0];
}
