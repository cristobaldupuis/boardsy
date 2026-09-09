export const CASA_GROUPS = [
  {
    id: "life",
    label: "Practical life",
    color: "#B56B4A",
    examples: ["Pouring", "Polishing", "Washing", "Flower arranging"],
  },
  {
    id: "sense",
    label: "Sensorial",
    color: "#C4A574",
    examples: ["Pink tower", "Colour tablets", "Sound boxes", "Walking on the line"],
  },
  {
    id: "culture",
    label: "Culture",
    color: "#5B7A6A",
    examples: ["Botany", "Land & water", "Puzzle maps", "Zoology"],
  },
  {
    id: "grace",
    label: "Grace & courtesy",
    color: "#C4785A",
    examples: ["Peace table", "Greeting", "Silence", "Snack"],
  },
  {
    id: "london",
    label: "London, Ontario",
    color: "#5A6F80",
    examples: [
      "Victoria Park",
      "Covent Garden Market",
      "Storybook Gardens",
      "Thames Path",
      "Springbank Park",
      "Eldon House",
    ],
  },
];

export const CASA_CORNERS = [
  { id: "begin", label: "BEGIN", role: "the bell", example: "The Bell" },
  { id: "silence", label: "SILENCE", role: "the silence game", example: "Silence" },
  { id: "garden", label: "GARDEN", role: "outdoor walk", example: "The Garden" },
  { id: "return", label: "RETURN", role: "back to the line", example: "The Line" },
] as const;

export const CASA_PRESETS: Record<string, Record<string, string[]>> = {
  lma: {
    life: ["Pouring", "Polishing", "Washing", "Flower arranging"],
    sense: ["Pink tower", "Colour tablets", "Sound boxes", "Walking on the line"],
    culture: ["Botany", "Land & water", "Puzzle maps", "Zoology"],
    grace: ["Peace table", "Greeting", "Silence", "Snack"],
    london: [
      "Victoria Park",
      "Covent Garden Market",
      "Storybook Gardens",
      "Thames Path",
      "Springbank Park",
      "Eldon House",
    ],
  },
  casa: {
    life: ["Pouring", "Polishing", "Washing", "Flower arranging"],
    sense: ["Pink tower", "Colour tablets", "Sound boxes", "Walking on the line"],
    culture: ["Botany", "Land & water", "Puzzle maps", "Zoology"],
    grace: ["Peace table", "Greeting", "Silence", "Snack"],
    london: ["The Park", "The Market", "The River", "The Garden", "The Library", "Home"],
  },
};
