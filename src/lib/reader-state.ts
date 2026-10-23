"use client";

export type ReadingProgressRecord = {
  storySlug: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumber: number;
  percent: number;
  updatedAt: string;
};

export type ReaderLibraryState = {
  followedStories: string[];
  savedStories: string[];
  likedStories: string[];
  followedCreators: string[];
  progress: Record<string, ReadingProgressRecord>;
};

const STORAGE_KEY = "ashabi-reader-state-v1";

const emptyState: ReaderLibraryState = {
  followedStories: [],
  savedStories: [],
  likedStories: [],
  followedCreators: [],
  progress: {},
};

export function loadReaderState(): ReaderLibraryState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<ReaderLibraryState>;
    return {
      followedStories: Array.isArray(parsed.followedStories)
        ? parsed.followedStories
        : [],
      savedStories: Array.isArray(parsed.savedStories)
        ? parsed.savedStories
        : [],
      likedStories: Array.isArray(parsed.likedStories)
        ? parsed.likedStories
        : [],
      followedCreators: Array.isArray(parsed.followedCreators)
        ? parsed.followedCreators
        : [],
      progress: parsed.progress ?? {},
    };
  } catch {
    return emptyState;
  }
}

function saveReaderState(next: ReaderLibraryState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("ashabi-reader-state-changed"));
  } catch {
    // Ignore storage quota errors
  }
}

function toggleItem(list: string[], slug: string): { next: string[]; active: boolean } {
  const exists = list.includes(slug);
  return {
    next: exists ? list.filter((item) => item !== slug) : [...list, slug],
    active: !exists,
  };
}

export function toggleFollowStory(storySlug: string): boolean {
  const current = loadReaderState();
  const { next, active } = toggleItem(current.followedStories, storySlug);
  saveReaderState({ ...current, followedStories: next });
  return active;
}

export function toggleSaveStory(storySlug: string): boolean {
  const current = loadReaderState();
  const { next, active } = toggleItem(current.savedStories, storySlug);
  saveReaderState({ ...current, savedStories: next });
  return active;
}

export function toggleLikeStory(storySlug: string): boolean {
  const current = loadReaderState();
  const { next, active } = toggleItem(current.likedStories, storySlug);
  saveReaderState({ ...current, likedStories: next });
  return active;
}

export function toggleFollowCreator(username: string): boolean {
  const current = loadReaderState();
  const { next, active } = toggleItem(current.followedCreators, username);
  saveReaderState({ ...current, followedCreators: next });
  return active;
}

export function recordReadingProgress(entry: ReadingProgressRecord) {
  const current = loadReaderState();
  saveReaderState({
    ...current,
    progress: {
      ...current.progress,
      [entry.storySlug]: entry,
    },
  });
}
