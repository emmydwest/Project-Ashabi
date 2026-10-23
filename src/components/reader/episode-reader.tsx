"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Chapter, Story } from "@/lib/stories";
import {
  loadReaderState,
  recordReadingProgress,
  toggleFollowStory,
  toggleLikeStory,
  toggleSaveStory,
} from "@/lib/reader-state";
import { trackEvent } from "@/lib/analytics";
import { reportContentSchema } from "@/lib/validation";

export function EpisodeReader({
  story,
  chapter,
  prev,
  next,
}: {
  story: Story;
  chapter: Chapter;
  prev?: Chapter;
  next?: Chapter;
}) {
  const [scrollPercent, setScrollPercent] = useState(15);
  const [fontScale, setFontScale] = useState<"normal" | "large">("normal");
  const [followed, setFollowed] = useState(() =>
    loadReaderState().followedStories.includes(story.slug),
  );
  const [saved, setSaved] = useState(() =>
    loadReaderState().savedStories.includes(story.slug),
  );
  const [liked, setLiked] = useState(() =>
    loadReaderState().likedStories.includes(story.slug),
  );
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState("");

  useEffect(() => {
    const state = loadReaderState();
    const sync = () => {
      const current = loadReaderState();
      setFollowed(current.followedStories.includes(story.slug));
      setSaved(current.savedStories.includes(story.slug));
      setLiked(current.likedStories.includes(story.slug));
    };
    window.addEventListener("ashabi-reader-state-changed", sync);

    trackEvent({
      event: "chapter_started",
      story_id: story.id,
      chapter_id: chapter.id,
      properties: {
        chapter_number: chapter.number,
        content_type: chapter.mode,
      },
    });

    recordReadingProgress({
      storySlug: story.slug,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      chapterNumber: chapter.number,
      percent: Math.max(state.progress[story.slug]?.percent ?? 0, 20),
      updatedAt: new Date().toISOString(),
    });

    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, [story.id, story.slug, chapter.id, chapter.slug, chapter.title, chapter.number, chapter.mode]);

  useEffect(() => {
    let lastBucket = 0;
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(
        100,
        Math.max(10, Math.round((window.scrollY / scrollable) * 100)),
      );
      setScrollPercent(pct);

      const bucket = pct >= 90 ? 100 : pct >= 75 ? 75 : pct >= 50 ? 50 : pct >= 25 ? 25 : 0;
      if (bucket > lastBucket) {
        lastBucket = bucket;
        recordReadingProgress({
          storySlug: story.slug,
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          chapterNumber: chapter.number,
          percent: bucket,
          updatedAt: new Date().toISOString(),
        });
        trackEvent({
          event: bucket === 100 ? "chapter_completed" : "reading_progress",
          story_id: story.id,
          chapter_id: chapter.id,
          properties: { percent_bucket: bucket },
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [story.id, story.slug, chapter.id, chapter.slug, chapter.title, chapter.number]);

  function handleReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = reportContentSchema.safeParse({
      storySlug: story.slug,
      chapterSlug: chapter.slug,
      reason: fd.get("reason"),
      details: fd.get("details"),
    });
    if (!parsed.success) {
      setReportStatus(parsed.error.issues[0]?.message ?? "Invalid report.");
      return;
    }
    trackEvent({
      event: "content_reported",
      story_id: story.id,
      chapter_id: chapter.id,
      properties: { reason: parsed.data.reason },
    });
    setReportStatus(
      "Thank you. Your report has been logged for our editorial & rights moderation team.",
    );
  }

  return (
    <main id="main" className="min-h-screen bg-[var(--bg-0)] pb-24">
      {/* Sticky Reader Subheader */}
      <div className="sticky top-[96px] z-10 border-b border-[var(--border)] bg-[rgba(5,7,10,0.88)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/stories/${story.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold-bright)] hover:underline shrink-0"
            >
              <Icon name="arrow-left" size={16} />
              <span>{story.title}</span>
            </Link>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-strong)] truncate">
              Ep. {chapter.number}: {chapter.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {chapter.mode !== "comic" ? (
              <button
                type="button"
                onClick={() =>
                  setFontScale(fontScale === "normal" ? "large" : "normal")
                }
                aria-label="Toggle reading text size"
                className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] bg-white/[0.04] text-[var(--text)] hover:border-[var(--border-gold)] cursor-pointer"
              >
                Text: {fontScale === "normal" ? "Standard" : "Large"}
              </button>
            ) : null}

            <span
              className="text-xs text-[var(--text-muted)] tabular-nums px-2"
              aria-label="Reading progress"
            >
              {scrollPercent}%
            </span>

            <button
              type="button"
              onClick={() => setReportOpen(!reportOpen)}
              aria-expanded={reportOpen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-[var(--border)] bg-white/[0.03] text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:border-[var(--border-gold)] cursor-pointer"
            >
              <Icon name="flag" size={14} />
              <span>Report</span>
            </button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-bright)] transition-all duration-150"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
      </div>

      {/* Non-intrusive Report Drawer */}
      {reportOpen ? (
        <section
          aria-label="Report content or rights concern"
          className="max-w-3xl mx-auto mt-4 px-4 sm:px-8"
        >
          <form
            onSubmit={handleReport}
            className="rounded-[18px] border border-[var(--border-gold)] bg-[rgba(8,13,18,0.95)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">
                Report an issue with this episode
              </h2>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                aria-label="Close report form"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)] cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-xs text-[var(--text-muted)] space-y-1">
                <span>Reason</span>
                <select
                  name="reason"
                  defaultValue="formatting_or_broken_page"
                  className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-strong)]"
                >
                  <option value="formatting_or_broken_page">
                    Broken image or formatting issue
                  </option>
                  <option value="rights_or_attribution">
                    Rights or attribution question
                  </option>
                  <option value="age_suitability">
                    Content suitability concern
                  </option>
                  <option value="other">Other feedback</option>
                </select>
              </label>
              <label className="block text-xs text-[var(--text-muted)] space-y-1">
                <span>Optional note</span>
                <input
                  name="details"
                  placeholder="Page number or brief context"
                  maxLength={500}
                  className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text-strong)]"
                />
              </label>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button type="submit" className="button primary">
                Submit Report
              </button>
              {reportStatus ? (
                <p className="text-xs text-[var(--gold-bright)]" role="status">
                  {reportStatus}
                </p>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      {/* Episode Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 pb-6 text-center space-y-2">
        <p className="eyebrow">
          {story.format} · Episode {chapter.number} · Free on Ashabi
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">{chapter.title}</h1>
        <p className="text-sm text-[var(--text-muted)]">
          By{" "}
          <Link
            href={`/creators/${story.creatorUsername}`}
            className="text-[var(--gold-bright)] hover:underline"
          >
            {story.creatorDisplayName}
          </Link>{" "}
          · {chapter.estimatedReadMinutes} min read
        </p>
      </header>

      {/* Comic / Sequential Vertical Canvas */}
      {chapter.panels?.length ? (
        <section
          aria-label="Comic pages"
          className="max-w-3xl mx-auto px-2 sm:px-6 space-y-8"
        >
          {chapter.panels.map((panel, index) => (
            <figure
              key={panel.id}
              className="rounded-[20px] overflow-hidden border border-[var(--border)] bg-[var(--bg-1)] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="relative aspect-[4/5] w-full bg-[var(--bg-2)]">
                <Image
                  src={`/images/${panel.image}.webp`}
                  alt={panel.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width:768px) 98vw, 760px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-black/30" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/75 border border-white/15 text-[var(--gold-bright)]">
                  Page {panel.pageNumber} · {panel.caption}
                </span>
              </div>

              {panel.dialogue?.length ? (
                <figcaption className="p-5 sm:p-6 space-y-3 border-t border-[var(--border)] bg-[rgba(8,13,18,0.92)]">
                  {panel.dialogue.map((line, i) => (
                    <div
                      key={i}
                      className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="block text-[11px] uppercase tracking-wider font-bold text-[var(--gold-bright)]">
                        {line.speaker}
                      </span>
                      <p className="text-sm sm:text-base text-[var(--text-strong)] mt-0.5 mb-0">
                        “{line.line}”
                      </p>
                    </div>
                  ))}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </section>
      ) : null}

      {/* Illustrated / Prose Reading Column */}
      {chapter.sections?.length ? (
        <article
          className={
            "max-w-[68ch] mx-auto px-4 sm:px-8 space-y-10 " +
            (fontScale === "large"
              ? "text-lg sm:text-xl leading-relaxed"
              : "text-base sm:text-[18px] leading-[1.8]")
          }
        >
          {chapter.sections.map((section) => (
            <section key={section.id} className="space-y-5">
              {section.heading ? (
                <h2 className="text-2xl font-bold text-[var(--gold-300)] pt-2">
                  {section.heading}
                </h2>
              ) : null}

              {section.illustration ? (
                <figure className="my-6 rounded-[20px] overflow-hidden border border-[var(--border)] bg-[var(--bg-2)]">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={`/images/${section.illustration.image}.webp`}
                      alt={section.illustration.alt}
                      fill
                      sizes="(max-width:768px) 95vw, 680px"
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
                    {section.illustration.caption}
                  </figcaption>
                </figure>
              ) : null}

              {section.paragraphs.map((p, idx) => (
                <p key={idx} className="text-[var(--text)]">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      ) : null}

      {/* End-of-Chapter Panel */}
      <section
        aria-label="End of episode actions"
        className="max-w-3xl mx-auto mt-14 px-4 sm:px-8"
      >
        <div className="rounded-[24px] border border-[var(--border-gold)] bg-[rgba(12,19,25,0.9)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">End of Episode {chapter.number}</p>
              <h2 className="text-2xl font-bold">
                {next
                  ? `Up Next: ${next.title}`
                  : `You’re caught up on ${story.title}`}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Follow this story to see new episodes in your library as soon as
                they release.
              </p>
            </div>

            {next ? (
              <Link
                href={`/read/${story.slug}/${next.slug}`}
                onClick={() =>
                  trackEvent({
                    event: "next_chapter_opened",
                    story_id: story.id,
                    chapter_id: next.id,
                    properties: {
                      from_chapter_id: chapter.id,
                      to_chapter_id: next.id,
                    },
                  })
                }
                className="button primary"
              >
                <span>Next Episode</span>
                <Icon name="arrow" size={18} />
              </Link>
            ) : (
              <Link href="/discover" className="button primary">
                <span>Discover More Stories</span>
                <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setFollowed(toggleFollowStory(story.slug))}
                aria-pressed={followed}
                className={
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border cursor-pointer " +
                  (followed
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-white/[0.04] text-[var(--text)]")
                }
              >
                <Icon name={followed ? "check" : "bell"} size={16} />
                <span>{followed ? "Following Story" : "Follow Story"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSaved(toggleSaveStory(story.slug))}
                aria-pressed={saved}
                className={
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border cursor-pointer " +
                  (saved
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-white/[0.04] text-[var(--text)]")
                }
              >
                <Icon name="bookmark" size={16} />
                <span>{saved ? "Saved in Library" : "Save"}</span>
              </button>

              <button
                type="button"
                onClick={() => setLiked(toggleLikeStory(story.slug))}
                aria-pressed={liked}
                className={
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border cursor-pointer " +
                  (liked
                    ? "border-[var(--border-gold)] bg-[rgba(245,189,67,0.18)] text-[var(--gold-bright)]"
                    : "border-[var(--border)] bg-white/[0.04] text-[var(--text)]")
                }
              >
                <Icon name="heart" size={16} />
                <span>{liked ? "Liked Episode" : "Like Episode"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {prev ? (
                <Link
                  href={`/read/${story.slug}/${prev.slug}`}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--gold-bright)] inline-flex items-center gap-1"
                >
                  <Icon name="arrow-left" size={15} />
                  <span>Previous Episode</span>
                </Link>
              ) : null}
              <Link
                href={`/stories/${story.slug}`}
                className="text-xs font-semibold text-[var(--gold-bright)] hover:underline"
              >
                All Episodes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
