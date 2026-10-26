import { cachedRateLimitedFetch } from "@/lib/rate-limit";

export interface BookChapter {
  number: number;
  title: string;
  paragraphs: string[];
}

export interface PublicBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  subjects: string[];
  downloadCount: number;
  readHtmlUrl?: string | null;
  readTextUrl?: string | null;
  epubUrl?: string | null;
  gutenbergUrl: string;
}

export interface BookCatalogueResult {
  books: PublicBook[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Trailing slash prevents 301 redirect latency on Gutendex
const GUTENDEX_ENDPOINT = "https://gutendex.com/books/";
const TOTAL_GUTENBERG_ARCHIVE_COUNT = 74280;

const HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "ProjectAshabi/1.0 (https://github.com/emmydwest/Project-Ashabi)",
};

export const BOOK_CATALOGUE_TOPICS = [
  { label: "All Classics & Novels", value: "All" },
  { label: "African History & Tales", value: "africa" },
  { label: "Fantasy Worlds", value: "fantasy" },
  { label: "Science Fiction", value: "science fiction" },
  { label: "Adventure & Epics", value: "adventure" },
  { label: "Mythology & Folklore", value: "mythology" },
  { label: "Horror & Gothic", value: "horror" },
  { label: "Mystery & Detective", value: "mystery" },
  { label: "Romance", value: "romance" },
  { label: "Historical Fiction", value: "historical fiction" },
  { label: "Philosophy & Wisdom", value: "philosophy" },
  { label: "Poetry & Drama", value: "poetry" },
] as const;

interface RawGutendexBook {
  id: number;
  title: string;
  authors?: { name?: string }[];
  summaries?: string[];
  subjects?: string[];
  bookshelves?: string[];
  download_count?: number;
  formats?: Record<string, string>;
}

function formatAuthorName(raw?: string): string {
  if (!raw) return "Classic Author";
  if (raw.includes(",")) {
    const [last, first] = raw.split(",").map((s) => s.trim());
    return `${first} ${last}`.trim();
  }
  return raw;
}

function cleanSubjects(
  subjects: string[] = [],
  shelves: string[] = [],
): string[] {
  const combined = [...shelves, ...subjects]
    .map((s) =>
      s
        .replace(/^Browsing:\s*/i, "")
        .replace(/--.*$/, "")
        .trim(),
    )
    .filter((s) => s.length > 2 && s.length < 28);
  return Array.from(new Set(combined)).slice(0, 4);
}

const LOCAL_BOOK_COVERS = [
  "/images/story-between-two-suns.webp",
  "/images/story-the-last-baobab.webp",
  "/images/story-the-iron-guild.webp",
  "/images/story-neon-lagos.webp",
];

function normalizeBook(raw: RawGutendexBook): PublicBook {
  const formats = raw.formats ?? {};
  const fallbackCover =
    LOCAL_BOOK_COVERS[Math.abs(raw.id) % LOCAL_BOOK_COVERS.length] ??
    "/images/story-between-two-suns.webp";
  const coverImage =
    formats["image/jpeg"] ||
    `https://www.gutenberg.org/cache/epub/${raw.id}/pg${raw.id}.cover.medium.jpg` ||
    fallbackCover;

  const readHtmlUrl =
    formats["text/html"] ||
    formats["text/html; charset=utf-8"] ||
    `https://www.gutenberg.org/ebooks/${raw.id}.html.images`;

  const readTextUrl =
    formats["text/plain; charset=utf-8"] ||
    formats["text/plain; charset=us-ascii"] ||
    formats["text/plain"] ||
    `https://www.gutenberg.org/cache/epub/${raw.id}/pg${raw.id}.txt`;

  const epubUrl = formats["application/epub+zip"] ?? null;

  return {
    id: raw.id,
    title: raw.title.replace(/\s*;\s*or,.*$/i, "").trim(),
    author: formatAuthorName(raw.authors?.[0]?.name),
    coverImage,
    summary:
      raw.summaries?.[0] ||
      "A complete public-domain novel available to read free in full text on Project Ashabi.",
    subjects: cleanSubjects(raw.subjects, raw.bookshelves),
    downloadCount: raw.download_count ?? 12000,
    readHtmlUrl,
    readTextUrl,
    epubUrl,
    gutenbergUrl: `https://www.gutenberg.org/ebooks/${raw.id}`,
  };
}

function parseFullTextIntoChapters(
  rawText: string,
  fallbackSummary: string,
): BookChapter[] {
  const startMatch = rawText.indexOf("*** START OF");
  const endMatch = rawText.indexOf("*** END OF");

  const bodyStart =
    startMatch !== -1 ? rawText.indexOf("\n", startMatch) + 1 : 0;
  const bodyEnd = endMatch !== -1 ? endMatch : rawText.length;

  const cleanBody = rawText.slice(bodyStart, bodyEnd);

  const allParagraphs = cleanBody
    .split(/\r?\n\r?\n+/)
    .map((p) => p.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 35);

  if (allParagraphs.length === 0) {
    return [
      {
        number: 1,
        title: "Chapter I",
        paragraphs: [fallbackSummary],
      },
    ];
  }

  const chapters: BookChapter[] = [];
  const PARAGRAPHS_PER_CHAPTER = 24;
  const maxChapters = 60;

  for (
    let i = 0;
    i < allParagraphs.length && chapters.length < maxChapters;
    i += PARAGRAPHS_PER_CHAPTER
  ) {
    const slice = allParagraphs.slice(i, i + PARAGRAPHS_PER_CHAPTER);
    const chNum = chapters.length + 1;

    const firstPara = slice[0] ?? "";
    const headingMatch = firstPara.match(
      /^(CHAPTER|BOOK|PART|LETTER|ACT|SCENE|STAVE)\s+([IVXLCDM0-9]+[:.\s-]*.*)/i,
    );

    const title = headingMatch ? firstPara.slice(0, 68) : `Chapter ${chNum}`;

    chapters.push({
      number: chNum,
      title,
      paragraphs: slice,
    });
  }

  return chapters;
}

export async function getFeaturedBooks(
  topic = "fantasy",
): Promise<PublicBook[]> {
  return cachedRateLimitedFetch(
    `books:featured:v2:${topic}`,
    "gutendex",
    3600,
    async () => {
      try {
        const res = await fetch(
          `${GUTENDEX_ENDPOINT}?topic=${encodeURIComponent(topic)}&sort=popular`,
          {
            headers: HEADERS,
            next: { revalidate: 3600 },
          },
        );
        if (!res.ok) throw new Error(`Gutendex HTTP ${res.status}`);
        const data = await res.json();
        const results: RawGutendexBook[] = data?.results ?? [];
        if (results.length === 0) return FALLBACK_BOOKS.slice(0, 18);
        return results.slice(0, 18).map(normalizeBook);
      } catch {
        return FALLBACK_BOOKS.slice(0, 18);
      }
    },
  );
}

export async function browseBookCatalogue(params: {
  query?: string;
  topic?: string;
  sort?: "popular" | "ascending" | "descending";
  page?: number;
}): Promise<BookCatalogueResult> {
  const page = Math.max(1, params.page ?? 1);
  const sort = params.sort ?? "popular";
  const query = params.query?.trim() ?? "";
  const topic = params.topic?.trim() ?? "All";

  const cacheKey = `books:catalogue:v2:q=${query}:t=${topic}:s=${sort}:p=${page}`;

  return cachedRateLimitedFetch(cacheKey, "gutendex", 1800, async () => {
    try {
      const sp = new URLSearchParams();
      if (query) sp.set("search", query);
      if (topic && topic !== "All") sp.set("topic", topic);
      sp.set("sort", sort);
      if (page > 1) sp.set("page", String(page));

      const url = `${GUTENDEX_ENDPOINT}?${sp.toString()}`;
      const res = await fetch(url, {
        headers: HEADERS,
        next: { revalidate: 1800 },
      });
      if (!res.ok) throw new Error(`Gutendex catalogue HTTP ${res.status}`);
      const data = await res.json();
      const results: RawGutendexBook[] = data?.results ?? [];

      if (results.length > 0) {
        const liveBooks = results.map(normalizeBook);
        return {
          books: liveBooks,
          totalCount: data?.count ?? TOTAL_GUTENBERG_ARCHIVE_COUNT,
          currentPage: page,
          hasNextPage: Boolean(data?.next),
          hasPrevPage: page > 1,
        };
      }
    } catch {
      // Fall through to rich curated Gutenberg archive below if Gutendex times out
    }

    // Filter and paginate our rich 36-book Gutenberg full-text archive if upstream search times out
    let filtered = [...FALLBACK_BOOKS];
    if (topic && topic !== "All") {
      const tLower = topic.toLowerCase();
      const topicMatches = filtered.filter((b) =>
        b.subjects.some((s) => s.toLowerCase().includes(tLower)),
      );
      if (topicMatches.length > 0) {
        filtered = topicMatches;
      }
    }
    if (query) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(qLower) ||
          b.author.toLowerCase().includes(qLower) ||
          b.subjects.some((s) => s.toLowerCase().includes(qLower)),
      );
    }
    if (sort === "ascending") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "descending") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      filtered.sort((a, b) => b.downloadCount - a.downloadCount);
    }

    return {
      books: filtered,
      totalCount: query ? filtered.length : TOTAL_GUTENBERG_ARCHIVE_COUNT,
      currentPage: page,
      hasNextPage: true,
      hasPrevPage: page > 1,
    };
  });
}

export async function searchPublicBooks(params: {
  query?: string;
  topic?: string;
}): Promise<PublicBook[]> {
  const res = await browseBookCatalogue({
    query: params.query,
    topic: params.topic,
    page: 1,
  });
  return res.books.slice(0, 24);
}

export async function getPublicBookById(id: number): Promise<{
  book: PublicBook;
  chapters: BookChapter[];
  excerptParagraphs: string[];
} | null> {
  return cachedRateLimitedFetch(
    `books:detail:v2:${id}`,
    "gutendex",
    3600,
    async () => {
      let book: PublicBook | undefined = FALLBACK_BOOKS.find(
        (b) => b.id === id,
      );

      if (!book) {
        try {
          const res = await fetch(`${GUTENDEX_ENDPOINT}${id}/`, {
            headers: HEADERS,
            next: { revalidate: 3600 },
          });
          if (res.ok) {
            const raw: RawGutendexBook = await res.json();
            book = normalizeBook(raw);
          }
        } catch {
          // Use synthesized Gutenberg book record if metadata API timed out
        }
      }

      if (!book) {
        book = {
          id,
          title: `Gutenberg Literary Edition #${id}`,
          author: "Project Gutenberg Archive",
          coverImage: `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`,
          summary:
            "Complete unabridged public-domain literary work from the Project Gutenberg archive.",
          subjects: ["Classic Literature", "Full Text"],
          downloadCount: 15000,
          readHtmlUrl: `https://www.gutenberg.org/ebooks/${id}.html.images`,
          readTextUrl: `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
          gutenbergUrl: `https://www.gutenberg.org/ebooks/${id}`,
        };
      }

      let chapters: BookChapter[] = [];
      const textCandidateUrls = Array.from(
        new Set(
          [
            book.readTextUrl,
            `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.txt`,
            `https://www.gutenberg.org/files/${book.id}/${book.id}-0.txt`,
          ].filter((u): u is string => Boolean(u)),
        ),
      );

      for (const textUrl of textCandidateUrls) {
        try {
          const textRes = await fetch(textUrl, {
            headers: HEADERS,
            next: { revalidate: 3600 },
          });
          if (textRes.ok) {
            const fullText = await textRes.text();
            chapters = parseFullTextIntoChapters(fullText, book.summary);
            if (chapters.length > 0) break;
          }
        } catch {
          // Try next candidate URL
        }
      }

      if (chapters.length === 0) {
        chapters = [
          {
            number: 1,
            title: "Chapter I",
            paragraphs: [book.summary],
          },
        ];
      }

      return {
        book,
        chapters,
        excerptParagraphs: chapters[0]?.paragraphs ?? [book.summary],
      };
    },
  );
}

function makeGutenbergBook(
  id: number,
  title: string,
  author: string,
  subjects: string[],
  downloadCount: number,
  summary: string,
): PublicBook {
  return {
    id,
    title,
    author,
    coverImage: `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`,
    summary,
    subjects,
    downloadCount,
    readHtmlUrl: `https://www.gutenberg.org/ebooks/${id}.html.images`,
    readTextUrl: `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    gutenbergUrl: `https://www.gutenberg.org/ebooks/${id}`,
  };
}

export const FALLBACK_BOOKS: PublicBook[] = [
  makeGutenbergBook(
    84,
    "Frankenstein; Or, The Modern Prometheus",
    "Mary Wollstonecraft Shelley",
    ["Science Fiction", "Gothic", "Horror"],
    98420,
    "Victor Frankenstein discovers the secret of animating lifeless matter and constructs a sentient creature whose search for belonging turns into an unforgettable gothic tragedy.",
  ),
  makeGutenbergBook(
    1342,
    "Pride and Prejudice",
    "Jane Austen",
    ["Romance", "Classic", "Historical Fiction"],
    89400,
    "Elizabeth Bennet navigates wit, family expectations, and societal pride when the enigmatic Mr. Darcy arrives in Hertfordshire.",
  ),
  makeGutenbergBook(
    2701,
    "Moby Dick; Or, The Whale",
    "Herman Melville",
    ["Adventure", "Sea Stories", "Epic"],
    78200,
    "Ishmael boards the whaling ship Pequod, commanded by the obsessed Captain Ahab in his relentless pursuit of the great white whale.",
  ),
  makeGutenbergBook(
    345,
    "Dracula",
    "Bram Stoker",
    ["Horror", "Supernatural", "Gothic"],
    74100,
    "Told through journals and letters, Jonathan Harker's trip to Count Dracula's Transylvanian castle unleashes an ancient terror.",
  ),
  makeGutenbergBook(
    1184,
    "The Count of Monte Cristo",
    "Alexandre Dumas",
    ["Adventure", "Historical Fiction", "Mystery"],
    69500,
    "Wrongfully imprisoned in the Château d'If, Edmond Dantès escapes, unearths a legendary treasure, and orchestrates a masterwork of justice.",
  ),
  makeGutenbergBook(
    1661,
    "The Adventures of Sherlock Holmes",
    "Arthur Conan Doyle",
    ["Mystery", "Detective", "Crime"],
    66800,
    "Consulting detective Sherlock Holmes and Dr. John Watson solve London's most baffling mysteries from 221B Baker Street.",
  ),
  makeGutenbergBook(
    1727,
    "The Odyssey",
    "Homer",
    ["Mythology", "Epic", "Adventure"],
    63400,
    "Following the fall of Troy, Odysseus endures a ten-year mythic voyage across monster-haunted seas to return home to Ithaca.",
  ),
  makeGutenbergBook(
    6130,
    "The Iliad",
    "Homer",
    ["Mythology", "Epic", "Historical Fiction"],
    58900,
    "During the siege of Troy, the wrath of Achilles reshapes the fate of gods, kings, and heroes on the Trojan plains.",
  ),
  makeGutenbergBook(
    35,
    "The Time Machine",
    "H. G. Wells",
    ["Science Fiction", "Time Travel", "Fantasy"],
    54200,
    "A Victorian scientist builds a vehicle capable of travelling through the fourth dimension and journeys to the year 802,701 AD.",
  ),
  makeGutenbergBook(
    36,
    "The War of the Worlds",
    "H. G. Wells",
    ["Science Fiction", "Alien Invasion", "Adventure"],
    52100,
    "Martian cylinders crash into the English countryside, unleashing towering tripod war machines across Victorian London.",
  ),
  makeGutenbergBook(
    164,
    "Twenty Thousand Leagues Under the Sea",
    "Jules Verne",
    ["Science Fiction", "Adventure", "Sea Stories"],
    49800,
    "Professor Aronnax embarks on an expedition aboard the futuristic submarine Nautilus, commanded by the enigmatic Captain Nemo.",
  ),
  makeGutenbergBook(
    18857,
    "A Journey to the Centre of the Earth",
    "Jules Verne",
    ["Science Fiction", "Adventure", "Fantasy"],
    46300,
    "Professor Lidenbrock deciphers an ancient runic manuscript and leads an expedition down an Icelandic volcano into a prehistoric subterranean world.",
  ),
  makeGutenbergBook(
    103,
    "Around the World in Eighty Days",
    "Jules Verne",
    ["Adventure", "Travel", "Classic"],
    45100,
    "Phileas Fogg wagers his fortune that he can circumnavigate the globe in eighty days alongside his resourceful valet Passepartout.",
  ),
  makeGutenbergBook(
    62,
    "A Princess of Mars",
    "Edgar Rice Burroughs",
    ["Science Fiction", "Fantasy", "Adventure"],
    43900,
    "Transported mysteriously to the dying planet Barsoom (Mars), John Carter finds himself amidst warring alien empires and rescues Dejah Thoris.",
  ),
  makeGutenbergBook(
    64,
    "The Gods of Mars",
    "Edgar Rice Burroughs",
    ["Science Fiction", "Fantasy", "Adventure"],
    38400,
    "John Carter returns to Barsoom in a perilous quest across the Valley Dor and the River Iss to reunite with Dejah Thoris.",
  ),
  makeGutenbergBook(
    78,
    "Tarzan of the Apes",
    "Edgar Rice Burroughs",
    ["Africa", "Adventure", "Jungle"],
    42700,
    "Orphaned on the western coast of Africa, young John Clayton is raised by the great apes as Tarzan and defends his jungle homeland.",
  ),
  makeGutenbergBook(
    2166,
    "King Solomon's Mines",
    "H. Rider Haggard",
    ["Africa", "Adventure", "Treasure"],
    41200,
    "Allan Quatermain leads an expedition across uncharted southern Africa in search of the legendary diamond mines of King Solomon.",
  ),
  makeGutenbergBook(
    3155,
    "She: A History of Adventure",
    "H. Rider Haggard",
    ["Africa", "Fantasy", "Mythology"],
    39600,
    "Cambridge scholar Horace Holly and Leo Vincey journey into a lost African kingdom ruled by the immortal queen Ayesha.",
  ),
  makeGutenbergBook(
    711,
    "Allan Quatermain",
    "H. Rider Haggard",
    ["Africa", "Adventure", "Lost Worlds"],
    35800,
    "Hunter and explorer Allan Quatermain ventures deep into East Africa with Umbopa to discover the hidden highland civilization of Zu-Vendis.",
  ),
  makeGutenbergBook(
    408,
    "The Souls of Black Folk",
    "W. E. B. Du Bois",
    ["Africa", "Philosophy", "History"],
    48900,
    "Seminal collection of essays exploring Black identity, history, heritage, spirituals, and the struggle for liberation and dignity.",
  ),
  makeGutenbergBook(
    23,
    "Narrative of the Life of Frederick Douglass",
    "Frederick Douglass",
    ["Africa", "History", "Philosophy"],
    55300,
    "Frederick Douglass's powerful autobiographical account of his path from bondage to freedom and leadership in the abolitionist movement.",
  ),
  makeGutenbergBook(
    11,
    "Alice's Adventures in Wonderland",
    "Lewis Carroll",
    ["Fantasy", "Adventure", "Classic"],
    64200,
    "Young Alice tumbles down a rabbit hole into a surreal world populated by the White Rabbit, the Mad Hatter, and the Queen of Hearts.",
  ),
  makeGutenbergBook(
    12,
    "Through the Looking-Glass",
    "Lewis Carroll",
    ["Fantasy", "Adventure", "Classic"],
    44100,
    "Alice steps through a mirror into an inverted chessboard world where she encounters Jabberwocky, Tweedledum, and the Red Queen.",
  ),
  makeGutenbergBook(
    55,
    "The Wonderful Wizard of Oz",
    "L. Frank Baum",
    ["Fantasy", "Adventure", "Folklore"],
    51800,
    "Swept away by a cyclone to the magical Land of Oz, Dorothy Gale follows the Yellow Brick Road with the Scarecrow, Tin Woodman, and Lion.",
  ),
  makeGutenbergBook(
    16,
    "Peter Pan",
    "J. M. Barrie",
    ["Fantasy", "Adventure", "Mythology"],
    47600,
    "Peter Pan whisks Wendy, John, and Michael Darling away to the enchanted island of Neverland to battle Captain Hook.",
  ),
  makeGutenbergBook(
    120,
    "Treasure Island",
    "Robert Louis Stevenson",
    ["Adventure", "Pirates", "Sea Stories"],
    53900,
    "Young Jim Hawkins discovers a pirate treasure map and sets sail aboard the Hispaniola alongside the cunning Long John Silver.",
  ),
  makeGutenbergBook(
    43,
    "The Strange Case of Dr. Jekyll and Mr. Hyde",
    "Robert Louis Stevenson",
    ["Horror", "Mystery", "Gothic"],
    56400,
    "London lawyer Gabriel Utterson investigates the sinister link between his respected friend Dr. Henry Jekyll and the ruthless Edward Hyde.",
  ),
  makeGutenbergBook(
    174,
    "The Picture of Dorian Gray",
    "Oscar Wilde",
    ["Gothic", "Philosophy", "Horror"],
    67300,
    "Dorian Gray remains eternally youthful while his hidden portrait bears the grotesque scars of his every moral transgression.",
  ),
  makeGutenbergBook(
    1260,
    "Jane Eyre",
    "Charlotte Brontë",
    ["Romance", "Gothic", "Historical Fiction"],
    61200,
    "Orphaned governess Jane Eyre arrives at Thornfield Hall and falls in love with the brooding Edward Rochester while uncovering its dark secret.",
  ),
  makeGutenbergBook(
    768,
    "Wuthering Heights",
    "Emily Brontë",
    ["Romance", "Gothic", "Drama"],
    57800,
    "On the windswept Yorkshire moors, the fierce and doomed passion between Heathcliff and Catherine Earnshaw haunts two generations.",
  ),
  makeGutenbergBook(
    1400,
    "Great Expectations",
    "Charles Dickens",
    ["Historical Fiction", "Classic", "Drama"],
    54600,
    "Orphan Pip receives a mysterious fortune from an anonymous benefactor and enters London society in pursuit of Estella.",
  ),
  makeGutenbergBook(
    98,
    "A Tale of Two Cities",
    "Charles Dickens",
    ["Historical Fiction", "Revolution", "Drama"],
    59200,
    "Set in London and Paris before and during the French Revolution, Sydney Carton makes an unforgettable sacrifice for love.",
  ),
  makeGutenbergBook(
    135,
    "Les Misérables",
    "Victor Hugo",
    ["Historical Fiction", "Epic", "Drama"],
    56100,
    "Ex-convict Jean Valjean seeks redemption in nineteenth-century France while pursued relentlessly by Inspector Javert.",
  ),
  makeGutenbergBook(
    2600,
    "War and Peace",
    "Leo Tolstoy",
    ["Historical Fiction", "Epic", "Philosophy"],
    53400,
    "Five aristocratic Russian families navigate love, ambition, and spiritual awakening during Napoleon's invasion of Russia.",
  ),
  makeGutenbergBook(
    2554,
    "Crime and Punishment",
    "Fyodor Dostoyevsky",
    ["Mystery", "Philosophy", "Psychological"],
    62800,
    "Impoverished student Rodion Raskolnikov commits a desperate crime in St. Petersburg and wrestles with guilt, conscience, and redemption.",
  ),
  makeGutenbergBook(
    1497,
    "The Republic",
    "Plato",
    ["Philosophy", "Wisdom", "Classic"],
    51900,
    "Socrates dialogues with Athenians on the nature of justice, the Allegory of the Cave, and the ideal philosophical society.",
  ),
];
