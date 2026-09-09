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

export const FAMILY_SPACES = [
  "Memories",
  "Adventures",
  "Traditions",
  "Inside Jokes",
  "Celebrations",
  "Favorites",
  "Then & Now",
  "Future Plans",
  "Sunday Table",
  "The Cabin",
  "First Home",
  "Airport Goodbyes",
  "Road Trips",
  "The Garden",
  "Movie Nights",
  "Birthdays",
  "The Dog's Chair",
  "Snow Days",
  "Reunions",
  "Late Night Talks",
  "The Porch",
  "Hometown",
];

export const WEDDING_SPACES = [
  "First Date",
  "The Proposal",
  "City Hall",
  "The Dance",
  "Honeymoon",
  "Our Kitchen",
  "Friends' Table",
  "The Apartment",
  "Weekend Trips",
  "Vows",
  "In-Laws",
  "The Song",
  "Rainy Taxis",
  "Shared Playlist",
  "Sunday Coffee",
  "The Rings",
  "New Traditions",
  "Pets We Adopted",
  "Letters",
  "The Afterparty",
  "Forever",
  "Home",
];

export const FRIENDS_SPACES = [
  "Group Chat",
  "The Dive Bar",
  "Road Trip",
  "That One Night",
  "Fantasy Draft",
  "Brunch",
  "The Couch",
  "Airport Pickup",
  "Inside Joke #7",
  "Camping Fail",
  "Karaoke",
  "The Apartment",
  "Pet Sitting",
  "Game Night",
  "Moving Day",
  "Reunion",
  "The Playlist",
  "Cheap Pizza",
  "New Year's",
  "The Secret Spot",
  "Call Me Later",
  "Always",
];

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
    presets: [
      { id: "family", name: "Family hometown", spaces: FAMILY_SPACES },
      { id: "wedding", name: "Wedding", spaces: WEDDING_SPACES },
      { id: "friends", name: "Friends", spaces: FRIENDS_SPACES },
    ],
    photoSlots: 8,
    includes: [
      "18\" folded board with your names and photos",
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
