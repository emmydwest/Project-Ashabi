"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  loadReaderState,
  toggleFollowStory,
  toggleLikeStory,
  toggleSaveStory,
  type ReadingProgressRecord,
} from "@/lib/reader-state";
import { trackEvent } from "@/lib/analytics";

export function StoryActions({
  storyId,
  storySlug,
  firstChapterSlug,
  storyTitle,
}: {
  storyId: string;
  storySlug: string;
  firstChapterSlug?: string;
  storyTitle: string;
}) {
  const [followed, setFollowed] = useState(() =>
    loadReaderState().followedStories.includes(storySlug),
  );
  const [saved, setSaved] = useState(() =>
    loadReaderState().savedStories.includes(storySlug),
  );
  const [liked, setLiked] = useState(() =>
    loadReaderState().likedStories.includes(storySlug),
  );
  const [progress, setProgress] = useState<ReadingProgressRecord | undefined>(
    () => loadReaderState().progress[storySlug],
  );
  const [shareNote, setShareNote] = useState("");

  useEffect(() => {
    const sync = () => {
      const state = loadReaderState();
      setFollowed(state.followedStories.includes(storySlug));
      setSaved(state.savedStories.includes(storySlug));
      setLiked(state.likedStories.includes(storySlug));
      setProgress(state.progress[storySlug]);
    };
    window.addEventListener("ashabi-reader-state-changed", sync);
    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, [storySlug]);

  const targetChapterSlug = progress?.chapterSlug ?? firstChapterSlug;

  function onFollow() {
    const active = toggleFollowStory(storySlug);
    setFollowed(active);
    trackEvent({
      event: active ? "story_followed" : "story_unfollowed",
      story_id: storyId,
      surface: "story_detail",
    });
  }

  function onSave() {
    const active = toggleSaveStory(storySlug);
    setSaved(active);
    trackEvent({
      event: active ? "story_saved" : "story_unsaved",
      story_id: storyId,
      surface: "story_detail",
    });
  }

  function onLike() {
    const active = toggleLikeStory(storySlug);
    setLiked(active);
    trackEvent({
      event: active ? "story_liked" : "story_unliked",
      story_id: storyId,
      surface: "story_detail",
    });
  }

  async function onShare() {
    const url = window.location.href;
    trackEvent({
      event: "share_clicked",
      story_id: storyId,
      surface: "story_detail",
    });
    if (navigator.share) {
      try {
        await navigator.share({ title: storyTitle, url });
        return;
      } catch {
        // Fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied to clipboard");
      window.setTimeout(() => setShareNote(""), 2500);
    } catch {
      setShareNote("Copy this page URL to share");
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {targetChapterSlug ? (
          <Link
            href={`/read/${storySlug}/${targetChapterSlug}`}
            className="button primary"
          >
            <Icon name="play" size={18} />
            <span>
              {progress
                ? `Continue Ep. ${progress.chapterNumber} (${progress.percent}%)`
                : "Read Free — Episode 1"}
            </span>
          </Link>
        ) : null}

        <button
          type="button"
          onClick={onFollow}
          aria-pressed={followed}
          className={
            "button " +
            (followed
              ? "primary"
              : "secondary")
          }
        >
          <Icon name={followed ? "check" : "bell"} size={18} />
          <span>{followed ? "Following Story" : "Follow for Updates"}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          aria-pressed={saved}
          aria-label={saved ? "Remove from Saved library" : "Save to library"}
          className={
            "inline-flex items-center gap-2 min-h-[46px] px-4 rounded-[15px] border transition-colors cursor-pointer " +
            (saved
              ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)]"
              : "border-[var(--border)] bg-white/[0.04] text-[var(--text)] hover:border-[var(--border-gold)]")
          }
        >
          <Icon name="bookmark" size={18} />
          <span className="text-sm font-medium">{saved ? "Saved" : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike story" : "Like story"}
          className={
            "inline-flex items-center gap-2 min-h-[46px] px-4 rounded-[15px] border transition-colors cursor-pointer " +
            (liked
              ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)]"
              : "border-[var(--border)] bg-white/[0.04] text-[var(--text)] hover:border-[var(--border-gold)]")
          }
        >
          <Icon name="heart" size={18} />
          <span className="text-sm font-medium">{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          type="button"
          onClick={onShare}
          aria-label="Share story link"
          className="inline-flex items-center gap-2 min-h-[46px] px-4 rounded-[15px] border border-[var(--border)] bg-white/[0.04] text-[var(--text)] hover:border-[var(--border-gold)] cursor-pointer"
        >
          <Icon name="share" size={18} />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {shareNote ? (
        <p className="text-xs text-[var(--gold-bright)]" role="status">
          {shareNote}
        </p>
      ) : null}
    </div>
  );
}
