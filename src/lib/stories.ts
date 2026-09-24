export type Story = {
  slug: string;
  title: string;
  genres: string[];
  image: string;
  description: string;
  format: string;
  rights: {
    source: "supplied-concept";
    status: "demo-only";
    permissionBasis: string;
  };
};
const rights: Story["rights"] = {
  source: "supplied-concept",
  status: "demo-only",
  permissionBasis:
    "User-supplied build-pack artwork for prototype use; production clearance pending.",
};
export const stories: Story[] = [
  {
    slug: "the-last-baobab",
    title: "The Last Baobab",
    genres: ["Fantasy", "Adventure", "Drama"],
    image: "featured-baobab",
    format: "Illustrated story",
    description:
      "In a world where the last sacred tree holds the memories of a forgotten era, a young girl must choose between saving her people and uncovering the truth.",
    rights,
  },
  {
    slug: "neon-lagos",
    title: "Neon Lagos",
    genres: ["Sci-Fi", "Action"],
    image: "story-neon-lagos",
    format: "Comic",
    description:
      "Beneath the neon skyline of a future Lagos, one discovery could change the city forever.",
    rights,
  },
  {
    slug: "ashes-and-petals",
    title: "Ashes & Petals",
    genres: ["Romance", "Drama"],
    image: "story-ashes-petals",
    format: "Illustrated story",
    description:
      "Between what was lost and what might bloom, two lives find an unexpected beginning.",
    rights,
  },
  {
    slug: "the-iron-guild",
    title: "The Iron Guild",
    genres: ["Fantasy", "Adventure"],
    image: "story-iron-guild",
    format: "Graphic novel",
    description:
      "An unlikely defender enters a world of ancient orders, impossible choices, and a legacy forged in iron.",
    rights,
  },
  {
    slug: "between-two-suns",
    title: "Between Two Suns",
    genres: ["Sci-Fi", "Drama"],
    image: "story-two-suns",
    format: "Serialized fiction",
    description:
      "Under twin suns, a lone traveller searches for a place to belong at the edge of a changing world.",
    rights,
  },
];
export const genres = [
  "All",
  "Action",
  "Adventure",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Drama",
];
export function filterStories(query: string, genre: string) {
  const q = query.trim().toLowerCase();
  return stories.filter(
    (s) =>
      (genre === "All" || s.genres.includes(genre)) &&
      [s.title, s.description, ...s.genres].join(" ").toLowerCase().includes(q),
  );
}
