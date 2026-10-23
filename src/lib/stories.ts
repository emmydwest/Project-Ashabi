export type ContentFormat =
  | "Comic"
  | "Graphic novel"
  | "Illustrated story"
  | "Serialized fiction";

export type ContentMode = "comic" | "illustrated" | "prose";

export type PublicationStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "restricted"
  | "archived";

export type ReleaseCadence = "Ongoing" | "Completed" | "New series";

export type AgeSuitability = "All Ages" | "Teen (13+)" | "Mature (16+)";

export type SourceLayer = "ashabi" | "public_domain" | "external_metadata";

export type RightsStatus =
  | "demo-only"
  | "verified_for_web"
  | "under_review"
  | "external_do_not_host"
  | "restricted";

export type RightsMetadata = {
  source: "supplied-concept" | SourceLayer;
  sourceLayer: SourceLayer;
  sourceName: string;
  sourceUrl?: string;
  status: RightsStatus;
  permissionBasis: string;
  ownerOrRightsholder: string;
  creditLabel: "Creator-Published" | "Ashabi Concept" | "Free Library" | "External Discovery";
  territory: string;
  verifiedForWeb: boolean;
};

export type ComicPanel = {
  id: string;
  pageNumber: number;
  image: string;
  caption: string;
  dialogue?: { speaker: string; line: string }[];
  alt: string;
};

export type ProseSection = {
  id: string;
  heading?: string;
  paragraphs: string[];
  illustration?: {
    image: string;
    caption: string;
    alt: string;
  };
};

export type Chapter = {
  id: string;
  storySlug: string;
  slug: string;
  number: number;
  title: string;
  synopsis: string;
  mode: ContentMode;
  publicationStatus: PublicationStatus;
  rightsCleared: boolean;
  publishedAt: string;
  estimatedReadMinutes: number;
  panels?: ComicPanel[];
  sections?: ProseSection[];
};

export type Creator = {
  id: string;
  username: string;
  displayName: string;
  roleLabel: string;
  location: string;
  avatarImage: string;
  bannerImage: string;
  bio: string;
  specialties: string[];
  publicLabel: "Featured Creator" | "Creator Partner (Sample)" | "Editorial Showcase";
  externalLinks?: { label: string; href: string }[];
};

export type Story = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  genres: string[];
  tags: string[];
  image: string;
  bannerImage?: string;
  description: string;
  synopsis: string;
  format: ContentFormat;
  contentMode: ContentMode;
  releaseStatus: ReleaseCadence;
  releaseSchedule: string;
  ageRating: AgeSuitability;
  language: string;
  creatorUsername: string;
  creatorDisplayName: string;
  creatorRole: string;
  publicationStatus: PublicationStatus;
  featuredRank?: number;
  updatedAt: string;
  chapters: Chapter[];
  rights: RightsMetadata;
};

export const creators: Creator[] = [
  {
    id: "cr-zuri-adesina",
    username: "zuri-adesina",
    displayName: "Zuri Adesina",
    roleLabel: "Writer & Worldbuilder",
    location: "Lagos, Nigeria",
    avatarImage: "featured-baobab",
    bannerImage: "hero-afrofuturist-city",
    bio: "Mythic fantasy and ecological folklore set across West African landscapes. Exploring memory, stewardship, and the quiet power of inherited stories.",
    specialties: ["Illustrated stories", "Mythic Fantasy", "Folklore"],
    publicLabel: "Editorial Showcase",
    externalLinks: [
      { label: "Portfolio Note", href: "/about" },
    ],
  },
  {
    id: "cr-tunde-salami",
    username: "tunde-salami",
    displayName: "Tunde Salami",
    roleLabel: "Comic Artist & Sequential Storyteller",
    location: "Lagos & Ibadan, Nigeria",
    avatarImage: "story-neon-lagos",
    bannerImage: "hero-character-city-alt",
    bio: "Sequential artist crafting cyber-noir action and near-future urban epics rooted in the kinetic rhythm of Lagos.",
    specialties: ["Comics", "Graphic novels", "Afrofuturism"],
    publicLabel: "Editorial Showcase",
  },
  {
    id: "cr-nia-okafor",
    username: "nia-okafor",
    displayName: "Nia Okafor",
    roleLabel: "Novelist & Visual Essayist",
    location: "Abuja, Nigeria",
    avatarImage: "story-ashes-petals",
    bannerImage: "featured-baobab",
    bio: "Writing intimate character dramas, speculative romance, and quiet stories of renewal across shifting worlds.",
    specialties: ["Serialized fiction", "Illustrated stories", "Drama"],
    publicLabel: "Editorial Showcase",
  },
];

const defaultRights = (
  owner: string,
  creditLabel: RightsMetadata["creditLabel"] = "Ashabi Concept",
): RightsMetadata => ({
  source: "supplied-concept",
  sourceLayer: "ashabi",
  sourceName: "Ashabi Curated Launch Collection",
  status: "demo-only",
  permissionBasis:
    "User-supplied build-pack artwork and editorial sample chapters for MVP validation; no third-party IP claimed.",
  ownerOrRightsholder: `${owner} (Creator retains copyright; sample web publication permission recorded)`,
  creditLabel,
  territory: "Worldwide (Web MVP)",
  verifiedForWeb: true,
});

export const stories: Story[] = [
  {
    id: "st-the-last-baobab",
    slug: "the-last-baobab",
    title: "The Last Baobab",
    subtitle: "Chronicles of the Rootkeepers",
    genres: ["Fantasy", "Adventure", "Drama"],
    tags: ["Folklore", "Memory", "Sacred Ecology"],
    image: "featured-baobab",
    bannerImage: "featured-baobab",
    format: "Illustrated story",
    contentMode: "illustrated",
    releaseStatus: "Ongoing",
    releaseSchedule: "New episodes every Friday",
    ageRating: "All Ages",
    language: "en",
    creatorUsername: "zuri-adesina",
    creatorDisplayName: "Zuri Adesina",
    creatorRole: "Story & Illustration Direction",
    publicationStatus: "published",
    featuredRank: 1,
    updatedAt: "2026-10-20T18:00:00Z",
    description:
      "In a world where the last sacred tree holds the memories of a forgotten era, a young girl must choose between saving her people and uncovering the truth.",
    synopsis:
      "Across the salt plains of Oyo-Koro, the great baobabs fell silent a century ago—all save one. Sixteen-year-old apprentice archivist Moremi hears a pulse inside the hollow trunk when the dry wind rises. What she discovers inside the bark could restore her valley's water or unravel the founding covenant of the elders.",
    rights: defaultRights("Zuri Adesina"),
    chapters: [
      {
        id: "ch-baobab-1",
        storySlug: "the-last-baobab",
        slug: "chapter-1-roots-of-amber",
        number: 1,
        title: "Roots of Amber",
        synopsis:
          "Moremi climbs the lantern terraces at dusk and hears the first resonant hum inside the last living baobab.",
        mode: "illustrated",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-10T12:00:00Z",
        estimatedReadMinutes: 5,
        sections: [
          {
            id: "s1",
            heading: "I. The Dusk Bell of Oyo-Koro",
            illustration: {
              image: "featured-baobab",
              caption: "The last baobab above the lantern terraces of Oyo-Koro.",
              alt: "A traveller standing beneath a glowing ancient baobab tree at sunset",
            },
            paragraphs: [
              "Every evening before the harmattan haze settled over the valley, Moremi climbed the forty-seven stone steps to the crown terrace. Her satchel clinked with brass ink-vials and strips of pressed locust-bean parchment. Below her, the riverbeds gleamed like ribbons of hammered copper—shallow, warm, and narrower than they had been the year before.",
              "The elders called the tree Igi-Iranti, the Vessel of Keeping. Its circumference took thirty grown weavers linking hands to encircle, and inside its fissured bark lay thousands of tiny resin seals. Each seal held a spoken memory from the age before the long drought.",
              "Keepers were taught never to press their palms directly against the heartwood after sundown. 'The tree sleeps so the valley may wake,' Archivist Fabiyi always reminded her. Yet tonight a thread of golden light seeped between the roots, warm as鍛ed bronze.",
            ],
          },
          {
            id: "s2",
            heading: "II. A Voice Beneath the Bark",
            paragraphs: [
              "Moremi knelt beside the western buttress. Where the bark should have been cool and chalky, it vibrated with a low, steady cadence—like a talking drum heard across water.",
              "When she touched the seam, the resin softened. A memory did not speak in words; it arrived as scent and horizon. She smelled rain on red laterite soil, heard the roar of three full rivers meeting at the basin, and saw a woman in an indigo cloak sealing a bronze key beneath the eastern root.",
              "'They did not lose the river,' the memory whispered through the grain of the wood. 'They traded its course to bind the ash-storm.'",
              "Footsteps echoed on the lower stair. Lantern light swung across the terrace wall. Moremi closed her fist around a flake of amber resin that had detached into her palm, her heart racing as the night watch called her name.",
            ],
          },
        ],
      },
      {
        id: "ch-baobab-2",
        storySlug: "the-last-baobab",
        slug: "chapter-2-the-indigo-key",
        number: 2,
        title: "The Indigo Key",
        synopsis:
          "With the amber seal in her satchel, Moremi deciphers the map hidden in the archive's oldest ledger.",
        mode: "illustrated",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-18T12:00:00Z",
        estimatedReadMinutes: 6,
        sections: [
          {
            id: "s1",
            heading: "I. The Ledger of Unread Seasons",
            illustration: {
              image: "hero-afrofuturist-city",
              caption: "Looking toward the high towers beyond the salt plain.",
              alt: "Golden towers rising against a sunset sky",
            },
            paragraphs: [
              "In the lower scriptorium, oil lamps burned with shea butter and dried mint. Moremi waited until the third watch before unrolling the Ledger of Unread Seasons—a chart no apprentice had requested in twenty years.",
              "Held over the warm amber flake, faded iron-gall ink darkened into contour lines. The eastern root did not end at the cliff wall; it tunnelled beneath the old aqueduct toward the sunken sluice gates of Іlú-Omi.",
              "If the water was still held behind the basalt dam, her people did not need to abandon the valley at the solstice. But opening the gate meant waking whatever the founders had locked behind it.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "st-neon-lagos",
    slug: "neon-lagos",
    title: "Neon Lagos",
    subtitle: "Circuit of the Lagoon",
    genres: ["Sci-Fi", "Action"],
    tags: ["Cyberpunk", "Lagos 2094", "Mystery"],
    image: "story-neon-lagos",
    bannerImage: "hero-character-city-alt",
    format: "Comic",
    contentMode: "comic",
    releaseStatus: "Ongoing",
    releaseSchedule: "Bi-weekly on Wednesdays",
    ageRating: "Teen (13+)",
    language: "en",
    creatorUsername: "tunde-salami",
    creatorDisplayName: "Tunde Salami",
    creatorRole: "Writer & Artist",
    publicationStatus: "published",
    featuredRank: 2,
    updatedAt: "2026-10-21T15:30:00Z",
    description:
      "Beneath the neon skyline of a future Lagos, one discovery could change the city forever.",
    synopsis:
      "In 2094, the Third Mainland Sky-Bridge hums with solar ferries and neural couriers. Disgraced transit engineer Damilola intercepts a ghost signal broadcasting from the submerged ruins of old Victoria Island—a signal carrying the voice of his missing sister.",
    rights: defaultRights("Tunde Salami"),
    chapters: [
      {
        id: "ch-neon-1",
        storySlug: "neon-lagos",
        slug: "episode-1-static-over-eko",
        number: 1,
        title: "Episode 1: Static Over Eko",
        synopsis:
          "A midnight courier run across the lagoon grid goes sideways when an unindexed beacon locks onto Damilola's visor.",
        mode: "comic",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-12T10:00:00Z",
        estimatedReadMinutes: 4,
        panels: [
          {
            id: "p1",
            pageNumber: 1,
            image: "story-neon-lagos",
            alt: "Damilola standing under magenta and cyan neon signs in future Lagos",
            caption: "SECTOR 04 — MARINA SKY-DOCK, 01:14 WAT.",
            dialogue: [
              {
                speaker: "Damilola",
                line: "Rain in October always carries static off the Atlantic wall. Tonight the static had a call-sign.",
              },
            ],
          },
          {
            id: "p2",
            pageNumber: 2,
            image: "hero-character-city-alt",
            alt: "Overlooking a sprawling luminous African megacity at twilight",
            caption: "ABOVE THE LAGOON TRANSIT RING.",
            dialogue: [
              {
                speaker: "Dispatch AI",
                line: "Courier 19-Delta, reroute immediately. Sub-level seven is restricted under Harbour Authority protocol.",
              },
              {
                speaker: "Damilola",
                line: "Sub-level seven has been underwater for twelve years. So why is it pinging my sister's encryption key?",
              },
            ],
          },
          {
            id: "p3",
            pageNumber: 3,
            image: "hero-afrofuturist-city",
            alt: "Golden light breaking through towering spires",
            caption: "THE OLD CAUSEWAY LOCK.",
            dialogue: [
              {
                speaker: "Kemi (Recorded Signal)",
                line: "If you can hear this, Dami, don't bring the guild. Bring the brass core from father's workshop.",
              },
            ],
          },
        ],
      },
      {
        id: "ch-neon-2",
        storySlug: "neon-lagos",
        slug: "episode-2-submerged-frequency",
        number: 2,
        title: "Episode 2: Submerged Frequency",
        synopsis:
          "Descending below the tidal barrier, Damilola confronts the automated sentries guarding the old server vaults.",
        mode: "comic",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-21T10:00:00Z",
        estimatedReadMinutes: 4,
        panels: [
          {
            id: "p1",
            pageNumber: 1,
            image: "story-neon-lagos",
            alt: "Neon reflections across wet concrete in future Lagos",
            caption: "TIDAL LOCK 09 — THIRTY METERS BELOW SEA LEVEL.",
            dialogue: [
              {
                speaker: "Damilola",
                line: "The turbines are still drawing power from the deep thermal vents. Someone kept this vault alive.",
              },
            ],
          },
          {
            id: "p2",
            pageNumber: 2,
            image: "story-iron-guild",
            alt: "Towering fortified citadel gates",
            caption: "VAULT ARCHIVE THRESHOLD.",
            dialogue: [
              {
                speaker: "Vault Warden",
                line: "Identity matched: Adesanya lineage. Opening memory partition Zero.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "st-ashes-and-petals",
    slug: "ashes-and-petals",
    title: "Ashes & Petals",
    subtitle: "Letters from the Terraced Garden",
    genres: ["Romance", "Drama"],
    tags: ["Slow Burn", "Botanical", "Second Chances"],
    image: "story-ashes-petals",
    bannerImage: "story-ashes-petals",
    format: "Illustrated story",
    contentMode: "illustrated",
    releaseStatus: "Ongoing",
    releaseSchedule: "Updated every Sunday",
    ageRating: "All Ages",
    language: "en",
    creatorUsername: "nia-okafor",
    creatorDisplayName: "Nia Okafor",
    creatorRole: "Author",
    publicationStatus: "published",
    featuredRank: 3,
    updatedAt: "2026-10-19T09:00:00Z",
    description:
      "Between what was lost and what might bloom, two lives find an unexpected beginning.",
    synopsis:
      "After the conservatory fire in Jos, botanical illustrator Halima returns to rebuild her grandmother's glasshouse of rare highland orchids. The architect assigned to the restoration is Chidi—the man who left five rainy seasons ago without a word.",
    rights: defaultRights("Nia Okafor"),
    chapters: [
      {
        id: "ch-ashes-1",
        storySlug: "ashes-and-petals",
        slug: "chapter-1-after-the-rain-glass",
        number: 1,
        title: "After the Rain Glass",
        synopsis:
          "Halima opens the charred cedar crates in the courtyard and finds the first living shoot beneath the soot.",
        mode: "illustrated",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-14T09:00:00Z",
        estimatedReadMinutes: 5,
        sections: [
          {
            id: "s1",
            heading: "I. Greenhouse on the Plateau",
            illustration: {
              image: "story-ashes-petals",
              caption: "Wild hibiscus and highland blossoms framing the old conservatory.",
              alt: "Portrait surrounded by warm glowing petals and golden light",
            },
            paragraphs: [
              "The morning air on the Jos plateau carried the crisp scent of eucalyptus and wet granite. Halima set her sketchbook on the stone parapet, tracing the iron ribs of the roof where smoked glass had once filtered the noon sun.",
              "When the gate latch clicked behind her, she expected the stonemason from Bukuru. Instead, a familiar leather tube of architectural blueprints rested against the doorframe.",
              "'You kept the bougainvillea along the south wall,' Chidi said quietly, stepping out from beneath the archway. His sleeves were rolled, charcoal smudged across his wrist just as it had been in their university studio.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "st-the-iron-guild",
    slug: "the-iron-guild",
    title: "The Iron Guild",
    subtitle: "Oath of the Smelters",
    genres: ["Fantasy", "Adventure"],
    tags: ["Epic Fantasy", "Craft", "Ancient Orders"],
    image: "story-iron-guild",
    bannerImage: "story-iron-guild",
    format: "Graphic novel",
    contentMode: "comic",
    releaseStatus: "Ongoing",
    releaseSchedule: "Monthly graphic novel chapters",
    ageRating: "Teen (13+)",
    language: "en",
    creatorUsername: "tunde-salami",
    creatorDisplayName: "Tunde Salami",
    creatorRole: "Creator",
    publicationStatus: "published",
    featuredRank: 4,
    updatedAt: "2026-10-17T14:00:00Z",
    description:
      "An unlikely defender enters a world of ancient orders, impossible choices, and a legacy forged in iron.",
    synopsis:
      "In the citadel of Nok-Tera, meteoric iron is sung from the earth by guild-smiths who bind vows into every blade. Young foundry stoker Adaeze accidentally awakens a dormant sovereign crest—marking her as both heir and heretic.",
    rights: defaultRights("Tunde Salami"),
    chapters: [
      {
        id: "ch-iron-1",
        storySlug: "the-iron-guild",
        slug: "issue-1-the-singing-anvil",
        number: 1,
        title: "Issue 1: The Singing Anvil",
        synopsis:
          "During the solstice forging, the great furnace refuses every master smith until Adaeze steps onto the slag floor.",
        mode: "comic",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-15T12:00:00Z",
        estimatedReadMinutes: 5,
        panels: [
          {
            id: "p1",
            pageNumber: 1,
            image: "story-iron-guild",
            alt: "Adaeze before the towering spires of the Iron Guild citadel",
            caption: "THE GREAT FOUNDRY OF NOK-TERA.",
            dialogue: [
              {
                speaker: "Master Orji",
                line: "Three hundred winters the Sovereign Anvil has waited for a voice that matches its pitch.",
              },
              {
                speaker: "Adaeze",
                line: "I only meant to bank the coals, Master. The iron answered on its own.",
              },
            ],
          },
          {
            id: "p2",
            pageNumber: 2,
            image: "featured-baobab",
            alt: "Golden horizon beyond the citadel",
            caption: "BEYOND THE SMELTER WALLS.",
            dialogue: [
              {
                speaker: "Master Orji",
                line: "When star-metal sings for an apprentice, the High Conclave listens. Pack your hammer before dawn.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "st-between-two-suns",
    slug: "between-two-suns",
    title: "Between Two Suns",
    subtitle: "The Sahel Orbit",
    genres: ["Sci-Fi", "Drama"],
    tags: ["Space Opera", "Diaspora", "Solitude"],
    image: "story-two-suns",
    bannerImage: "story-two-suns",
    format: "Serialized fiction",
    contentMode: "prose",
    releaseStatus: "Ongoing",
    releaseSchedule: "Weekly chapters on Tuesdays",
    ageRating: "All Ages",
    language: "en",
    creatorUsername: "nia-okafor",
    creatorDisplayName: "Nia Okafor",
    creatorRole: "Author",
    publicationStatus: "published",
    featuredRank: 5,
    updatedAt: "2026-10-16T11:00:00Z",
    description:
      "Under twin suns, a lone traveller searches for a place to belong at the edge of a changing world.",
    synopsis:
      "Cartographer Idris tends the relay stations along the terminator belt of Kemet-B, a tidally locked world lit by binary stars. When a century-old sleeper vessel enters orbit from Earth's West African launch ark, Idris must guide its passengers down to a desert that remembers their ancestors.",
    rights: defaultRights("Nia Okafor"),
    chapters: [
      {
        id: "ch-suns-1",
        storySlug: "between-two-suns",
        slug: "chapter-1-the-amber-meridian",
        number: 1,
        title: "Chapter 1: The Amber Meridian",
        synopsis:
          "At Station Nine, the dual shadows of the binary stars align as an unscheduled vessel breaks atmospheric silence.",
        mode: "prose",
        publicationStatus: "published",
        rightsCleared: true,
        publishedAt: "2026-10-16T11:00:00Z",
        estimatedReadMinutes: 6,
        sections: [
          {
            id: "s1",
            heading: "Station Nine, 14° North of the Terminator",
            paragraphs: [
              "On Kemet-B, every object casts two shadows: one sharp and violet from the dwarf star सूरा, the other long and honey-gold from its elder companion. Idris measured his days by the angle between them.",
              "For six orbital cycles he had calibrated the wind-harps alone, recording dust migrations across the silicate dunes and transmitting weather tables to the agricultural domes three hundred kilometres east.",
              "At 04:19 station time, the copper dish on the roof pivoted north on its own. Through the static came a chorus of Yoruba and Hausa telemetry markers—an approach protocol last used by the Lagos-Dakar Ark Fleet ninety years ago.",
              "Idris set down his compass, pulled his dust-cloak from the peg by the airlock, and keyed the beacon transmitter to manual. Nobody was supposed to be out there left to come home. Yet the sky above the amber meridian was burning with a re-entry trail.",
            ],
          },
        ],
      },
    ],
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

export const contentFormats: ("All" | ContentFormat)[] = [
  "All",
  "Comic",
  "Graphic novel",
  "Illustrated story",
  "Serialized fiction",
];

export const releaseStatuses: ("All" | ReleaseCadence)[] = [
  "All",
  "Ongoing",
  "Completed",
];

export function isPubliclyVisibleStory(story: Story): boolean {
  return (
    story.publicationStatus === "published" &&
    story.rights.verifiedForWeb &&
    story.rights.status !== "restricted"
  );
}

export function getPublicStories(): Story[] {
  return stories.filter(isPubliclyVisibleStory);
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getPublicStories().find((s) => s.slug === slug);
}

export function getChapterBySlug(
  storySlug: string,
  chapterSlug: string,
): { story: Story; chapter: Chapter; prev?: Chapter; next?: Chapter } | undefined {
  const story = getStoryBySlug(storySlug);
  if (!story) return undefined;
  const publishedChapters = story.chapters.filter(
    (c) => c.publicationStatus === "published" && c.rightsCleared,
  );
  const index = publishedChapters.findIndex((c) => c.slug === chapterSlug);
  if (index === -1) return undefined;
  return {
    story,
    chapter: publishedChapters[index],
    prev: index > 0 ? publishedChapters[index - 1] : undefined,
    next:
      index < publishedChapters.length - 1
        ? publishedChapters[index + 1]
        : undefined,
  };
}

export function getCreatorByUsername(username: string): Creator | undefined {
  return creators.find((c) => c.username === username);
}

export function getStoriesByCreator(username: string): Story[] {
  return getPublicStories().filter((s) => s.creatorUsername === username);
}

export type DiscoverFilters = {
  query?: string;
  genre?: string;
  format?: string;
  status?: string;
  sort?: "featured" | "recent" | "title";
};

export function filterStories(
  query: string,
  genre: string,
  extra?: Omit<DiscoverFilters, "query" | "genre">,
): Story[] {
  const q = query.trim().toLowerCase();
  const format = extra?.format ?? "All";
  const status = extra?.status ?? "All";
  const sort = extra?.sort ?? "featured";

  const filtered = getPublicStories().filter((s) => {
    const matchesGenre = genre === "All" || s.genres.includes(genre);
    const matchesFormat = format === "All" || s.format === format;
    const matchesStatus = status === "All" || s.releaseStatus === status;
    const haystack = [
      s.title,
      s.subtitle ?? "",
      s.description,
      s.creatorDisplayName,
      ...s.genres,
      ...s.tags,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !q || haystack.includes(q);
    return matchesGenre && matchesFormat && matchesStatus && matchesQuery;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "recent")
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return (a.featuredRank ?? 99) - (b.featuredRank ?? 99);
  });
}
