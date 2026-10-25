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

const GUTENDEX_ENDPOINT = "https://gutendex.com/books";

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

function normalizeBook(raw: RawGutendexBook): PublicBook {
  const formats = raw.formats ?? {};
  const coverImage =
    formats["image/jpeg"] ||
    `https://www.gutenberg.org/cache/epub/${raw.id}/pg${raw.id}.cover.medium.jpg`;

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
        title: "Chapter 1 — Opening",
        paragraphs: [fallbackSummary],
      },
    ];
  }

  const chapters: BookChapter[] = [];
  const PARAGRAPHS_PER_CHAPTER = 24;
  const maxChapters = 45;

  for (
    let i = 0;
    i < allParagraphs.length && chapters.length < maxChapters;
    i += PARAGRAPHS_PER_CHAPTER
  ) {
    const slice = allParagraphs.slice(i, i + PARAGRAPHS_PER_CHAPTER);
    const chNum = chapters.length + 1;

    // Detect if the first paragraph in this slice looks like a chapter heading
    const firstPara = slice[0] ?? "";
    const headingMatch = firstPara.match(
      /^(CHAPTER|BOOK|PART|LETTER|ACT|SCENE|STAVE)\s+([IVXLCDM0-9]+[:.\s-]*.*)/i,
    );

    const title = headingMatch
      ? firstPara.slice(0, 68)
      : `Chapter ${chNum}`;

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
  try {
    const res = await fetch(
      `${GUTENDEX_ENDPOINT}?topic=${encodeURIComponent(topic)}&sort=popular`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`Gutendex HTTP ${res.status}`);
    const data = await res.json();
    const results: RawGutendexBook[] = data?.results ?? [];
    if (results.length === 0) return FALLBACK_BOOKS;
    return results.slice(0, 12).map(normalizeBook);
  } catch {
    return FALLBACK_BOOKS;
  }
}

export async function searchPublicBooks(params: {
  query?: string;
  topic?: string;
}): Promise<PublicBook[]> {
  try {
    const sp = new URLSearchParams();
    if (params.query?.trim()) sp.set("search", params.query.trim());
    if (params.topic && params.topic !== "All") sp.set("topic", params.topic);

    const url = `${GUTENDEX_ENDPOINT}${sp.size ? `?${sp.toString()}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Gutendex search HTTP ${res.status}`);
    const data = await res.json();
    const results: RawGutendexBook[] = data?.results ?? [];
    return results.slice(0, 15).map(normalizeBook);
  } catch {
    return FALLBACK_BOOKS;
  }
}

export async function getPublicBookById(id: number): Promise<{
  book: PublicBook;
  chapters: BookChapter[];
  excerptParagraphs: string[];
} | null> {
  try {
    const res = await fetch(`${GUTENDEX_ENDPOINT}/${id}`, {
      next: { revalidate: 3600 },
    });
    let book: PublicBook | undefined;
    if (res.ok) {
      const raw: RawGutendexBook = await res.json();
      book = normalizeBook(raw);
    } else {
      book = FALLBACK_BOOKS.find((b) => b.id === id);
    }
    if (!book) return null;

    let chapters: BookChapter[] = [];
    const textCandidateUrls = [
      book.readTextUrl,
      `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.txt`,
    ].filter((u): u is string => Boolean(u));

    for (const textUrl of textCandidateUrls) {
      try {
        const textRes = await fetch(textUrl, {
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
          title: "Chapter 1 — Opening",
          paragraphs: [book.summary],
        },
      ];
    }

    return {
      book,
      chapters,
      excerptParagraphs: chapters[0]?.paragraphs ?? [book.summary],
    };
  } catch {
    const fallback = FALLBACK_BOOKS.find((b) => b.id === id);
    if (!fallback) return null;
    const fallbackChapters: BookChapter[] = [
      {
        number: 1,
        title: "Chapter 1 — Opening",
        paragraphs: [fallback.summary],
      },
    ];
    return {
      book: fallback,
      chapters: fallbackChapters,
      excerptParagraphs: [fallback.summary],
    };
  }
}

export const FALLBACK_BOOKS: PublicBook[] = [
  {
    id: 84,
    title: "Frankenstein; Or, The Modern Prometheus",
    author: "Mary Wollstonecraft Shelley",
    coverImage: "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
    summary:
      "Victor Frankenstein discovers the secret of animating lifeless matter and constructs a sentient creature whose search for belonging turns into an unforgettable gothic tragedy.",
    subjects: ["Science Fiction", "Gothic Fiction", "Classic"],
    downloadCount: 98420,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/84.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/84/pg84.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/84",
  },
  {
    id: 35,
    title: "The Time Machine",
    author: "H. G. Wells",
    coverImage: "https://www.gutenberg.org/cache/epub/35/pg35.cover.medium.jpg",
    summary:
      "A Victorian scientist builds a vehicle capable of travelling through the fourth dimension and journeys to the year 802,701 AD, discovering the Eloi and the Morlocks.",
    subjects: ["Science Fiction", "Time Travel", "Dystopian"],
    downloadCount: 41200,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/35.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/35/pg35.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/35",
  },
  {
    id: 164,
    title: "Twenty Thousand Leagues Under the Sea",
    author: "Jules Verne",
    coverImage:
      "https://www.gutenberg.org/cache/epub/164/pg164.cover.medium.jpg",
    summary:
      "Professor Aronnax embarks on an expedition aboard the futuristic submarine Nautilus, commanded by the enigmatic Captain Nemo across the world's uncharted ocean depths.",
    subjects: ["Adventure", "Science Fiction", "Sea Stories"],
    downloadCount: 38900,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/164.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/164/pg164.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/164",
  },
  {
    id: 345,
    title: "Dracula",
    author: "Bram Stoker",
    coverImage:
      "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",
    summary:
      "Told through journals and letters, Jonathan Harker's business trip to Count Dracula's Transylvanian castle unleashes an ancient supernatural terror upon London.",
    subjects: ["Horror", "Supernatural", "Gothic"],
    downloadCount: 64100,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/345.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/345/pg345.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/345",
  },
  {
    id: 62,
    title: "A Princess of Mars",
    author: "Edgar Rice Burroughs",
    coverImage: "https://www.gutenberg.org/cache/epub/62/pg62.cover.medium.jpg",
    summary:
      "Transported mysteriously to the dying planet Barsoom (Mars), John Carter finds himself amidst warring alien empires and rescues the captive princess Dejah Thoris.",
    subjects: ["Planetary Romance", "Sci-Fi", "Adventure"],
    downloadCount: 29500,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/62.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/62/pg62.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/62",
  },
  {
    id: 1727,
    title: "The Odyssey",
    author: "Homer",
    coverImage:
      "https://www.gutenberg.org/cache/epub/1727/pg1727.cover.medium.jpg",
    summary:
      "Following the fall of Troy, Odysseus endures a ten-year mythic voyage across monster-haunted seas to return home to Ithaca and reclaim his kingdom.",
    subjects: ["Mythology", "Epic", "Adventure"],
    downloadCount: 53400,
    readHtmlUrl: "https://www.gutenberg.org/ebooks/1727.html.images",
    readTextUrl: "https://www.gutenberg.org/cache/epub/1727/pg1727.txt",
    gutenbergUrl: "https://www.gutenberg.org/ebooks/1727",
  },
];
