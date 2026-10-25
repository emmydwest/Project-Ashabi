"use client";

import { useEffect, useMemo, useState } from "react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { getPublicStories } from "@/lib/stories";
import {
  loadReaderState,
  toggleFollowStory,
  toggleLikeStory,
  toggleSaveStory,
  type ReaderLibraryState,
} from "@/lib/reader-state";

type TabKey = "following" | "saved" | "history" | "likes";

export function ReaderLibrary({ initialTab = "following" }: { initialTab?: TabKey }) {
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [state, setState] = useState<ReaderLibraryState>(() =>
    loadReaderState(),
  );

  useEffect(() => {
    const sync = () => setState(loadReaderState());
    window.addEventListener("ashabi-reader-state-changed", sync);
    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, []);

  const allStories = useMemo(() => getPublicStories(), []);

  const items = useMemo(() => {
    if (tab === "following") {
      return allStories.filter((s) => state.followedStories.includes(s.slug));
    }
    if (tab === "saved") {
      return allStories.filter((s) => state.savedStories.includes(s.slug));
    }
    if (tab === "likes") {
      return allStories.filter((s) => state.likedStories.includes(s.slug));
    }
    return allStories.filter((s) => Boolean(state.progress[s.slug]));
  }, [allStories, state, tab]);

  const tabs: { key: TabKey; label: string; icon: "bell" | "bookmark" | "clock" | "heart"; count: number }[] = [
    {
      key: "following",
      label: "Following",
      icon: "bell",
      count: state.followedStories.length,
    },
    {
      key: "saved",
      label: "Saved",
      icon: "bookmark",
      count: state.savedStories.length,
    },
    {
      key: "history",
      label: "Reading History",
      icon: "clock",
      count: Object.keys(state.progress).length,
    },
    {
      key: "likes",
      label: "Liked",
      icon: "heart",
      count: state.likedStories.length,
    },
  ];

  return (
    <main id="main" className="page space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your Personal Shelf</p>
          <h1 className="text-3xl sm:text-4xl font-bold">My Library</h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1">
            Track stories you follow, resume episodes where you left off, and
            see new release indicators.
          </p>
        </div>
        <Link href="/discover" className="button secondary">
          <span>Browse Catalog</span>
          <Icon name="arrow" size={16} />
        </Link>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Library sections"
        className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4"
      >
        {tabs.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.key)}
              className={
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer " +
                (active
                  ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)] shadow-[var(--gold-glow)]"
                  : "border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-muted)] hover:text-[var(--text-strong)]")
              }
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/40 text-[var(--ivory)]">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((story) => {
            const prog = state.progress[story.slug];
            const firstChapter = story.chapters[0];
            const targetChapterSlug = prog?.chapterSlug ?? firstChapter?.slug;
            const hasUnreadRelease =
              story.chapters.length > (prog?.chapterNumber ?? 0);

            return (
              <article
                key={story.slug}
                className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-2)] p-4 sm:p-5 flex gap-4 items-center justify-between"
              >
                <div className="flex gap-4 items-center min-w-0">
                  <Link
                    href={`/stories/${story.slug}`}
                    className="relative w-20 h-28 rounded-[14px] overflow-hidden shrink-0 border border-[var(--border)]"
                  >
                    <Image
                      src={`/images/${story.image}.webp`}
                      alt={story.title}
                      fill
                      sizes="80px"
                    />
                  </Link>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-[var(--gold-bright)] font-semibold">
                        {story.format}
                      </span>
                      {hasUnreadRelease ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(72,199,142,0.16)] border border-[rgba(72,199,142,0.45)] text-[#9be7c4]">
                          Unread episode available
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase bg-white/[0.05] text-[var(--text-muted)]">
                          Caught up
                        </span>
                      )}
                    </div>

                    <Link href={`/stories/${story.slug}`}>
                      <h2 className="text-lg font-bold hover:text-[var(--gold-bright)] truncate">
                        {story.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-[var(--text-muted)]">
                      By {story.creatorDisplayName} · {story.chapters.length}{" "}
                      {story.chapters.length === 1 ? "episode" : "episodes"}
                    </p>

                    {prog ? (
                      <div className="pt-1 space-y-1">
                        <div className="h-1.5 w-44 max-w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[var(--gold)]"
                            style={{ width: `${prog.percent}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[var(--ivory)]">
                          Ep. {prog.chapterNumber}: {prog.chapterTitle} (
                          {prog.percent}%)
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {targetChapterSlug ? (
                    <Link
                      href={`/read/${story.slug}/${targetChapterSlug}`}
                      className="button primary text-xs px-4 py-2"
                    >
                      <span>{prog ? "Resume" : "Start"}</span>
                      <Icon name="arrow" size={14} />
                    </Link>
                  ) : null}

                  {tab === "following" ? (
                    <button
                      type="button"
                      onClick={() => toggleFollowStory(story.slug)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
                    >
                      Unfollow
                    </button>
                  ) : null}
                  {tab === "saved" ? (
                    <button
                      type="button"
                      onClick={() => toggleSaveStory(story.slug)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : null}
                  {tab === "likes" ? (
                    <button
                      type="button"
                      onClick={() => toggleLikeStory(story.slug)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
                    >
                      Unlike
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="book" size={32} />
          <h2>Nothing in {tabs.find((t) => t.key === tab)?.label} yet</h2>
          <p>
            Explore the free catalog to start reading, follow ongoing stories
            for release notifications, or save titles for later.
          </p>
          <Link href="/discover" className="button primary">
            Explore Free Stories <Icon name="arrow" size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}
