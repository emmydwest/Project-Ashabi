"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { getPublicStories } from "@/lib/stories";
import { createClient } from "@/lib/supabase/client";
import {
  loadReaderState,
  toggleSaveStory,
  type ReaderLibraryState,
} from "@/lib/reader-state";

type Preferences = { genres: string[]; formats: string[]; discovery: string[] };

export function ReaderHome() {
  const [preferences, setPreferences] = useState<Preferences | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.sessionStorage.getItem("ashabi-preferences");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as Preferences;
    } catch {
      return null;
    }
  });
  const [name, setName] = useState("Reader");
  const [libraryState, setLibraryState] = useState<ReaderLibraryState>(() =>
    loadReaderState(),
  );

  useEffect(() => {
    const sync = () => setLibraryState(loadReaderState());
    window.addEventListener("ashabi-reader-state-changed", sync);

    createClient()
      ?.auth.getUser()
      .then(({ data }) => {
        const user = data.user;
        if (!user) return;
        setName(
          String(
            user.user_metadata?.display_name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Reader",
          ),
        );
        const remote = user.user_metadata?.preferences as
          | Preferences
          | undefined;
        if (remote) {
          setPreferences(remote);
          sessionStorage.setItem("ashabi-preferences", JSON.stringify(remote));
        }
      })
      .catch(() => null);

    return () =>
      window.removeEventListener("ashabi-reader-state-changed", sync);
  }, []);

  const stories = useMemo(() => getPublicStories(), []);

  const recommendations = useMemo(() => {
    const matched = preferences?.genres.length
      ? stories.filter((story) =>
          story.genres.some((genre) => preferences.genres.includes(genre)),
        )
      : stories.slice(1);
    return [
      ...matched,
      ...stories.filter((story) => !matched.includes(story)),
    ].slice(0, 4);
  }, [preferences, stories]);

  const activeProgressEntries = Object.values(libraryState.progress).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const latestProgress = activeProgressEntries[0];
  const feature =
    stories.find((s) => s.slug === latestProgress?.storySlug) ?? stories[0];
  const featureProgressPercent = latestProgress?.percent ?? 0;
  const featureTargetChapter =
    latestProgress?.chapterSlug ?? feature.chapters[0]?.slug;
  const featureSaved = libraryState.savedStories.includes(feature.slug);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <main id="main" className="reader-dashboard">
      <div className="reader-city" aria-hidden="true">
        <Image
          src="/images/hero-afrofuturist-city.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <span />
      </div>
      <div className="reader-orb" aria-hidden="true" />

      <div className="reader-dashboard-inner">
        <section className="reader-greeting">
          <div>
            <h1>
              {greeting}, <span>{name}.</span>
            </h1>
            <p>All published stories and episodes are free to read.</p>
          </div>
          <p className="reader-mantra">
            Different stories.
            <br />
            Same human dreams.
          </p>
        </section>

        <section className="reader-primary-grid">
          <article className="reader-continue">
            <div className="reader-panel-title">
              <Icon name="book" />
              <h2>Continue Reading</h2>
            </div>
            <div className="reader-feature">
              <Link
                href={`/stories/${feature.slug}`}
                className="reader-feature-art"
              >
                <Image
                  src={`/images/${feature.image}.webp`}
                  alt={`${feature.title} artwork`}
                  fill
                  sizes="(max-width:900px) 100vw, 48vw"
                />
                <span>{feature.title}</span>
              </Link>
              <div className="reader-feature-copy">
                <div className="reader-tags">
                  {feature.genres.map((genre) => (
                    <span key={genre}>{genre}</span>
                  ))}
                </div>
                <h3>{feature.title}</h3>
                <p className="reader-chapter">
                  {latestProgress
                    ? `Episode ${latestProgress.chapterNumber}: ${latestProgress.chapterTitle}`
                    : `Episode 1: ${feature.chapters[0]?.title ?? "Start from the beginning"}`}
                </p>
                <p>{feature.description}</p>
                <div className="reader-progress">
                  <span style={{ width: `${featureProgressPercent}%` }} />
                </div>
                <div className="reader-progress-label">
                  <span>
                    {featureProgressPercent > 0
                      ? "In progress"
                      : "Ready to begin"}
                  </span>
                  <strong>{featureProgressPercent}%</strong>
                </div>
                <div className="reader-feature-actions">
                  <Link
                    className="button primary"
                    href={
                      featureTargetChapter
                        ? `/read/${feature.slug}/${featureTargetChapter}`
                        : `/stories/${feature.slug}`
                    }
                  >
                    {featureProgressPercent > 0
                      ? "Continue Reading"
                      : "Start Reading"}{" "}
                    <Icon name="arrow" />
                  </Link>
                  <button
                    type="button"
                    aria-label={
                      featureSaved ? "Remove from saved" : "Save story"
                    }
                    aria-pressed={featureSaved}
                    onClick={() => toggleSaveStory(feature.slug)}
                  >
                    <Icon name="bookmark" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          <aside className="reader-library">
            <div className="reader-panel-title">
              <Icon name="book" />
              <h2>My Library</h2>
            </div>
            <Link href="/library">
              <span>
                <Icon name="bookmark" />
              </span>
              <div>
                <strong>Saved ({libraryState.savedStories.length})</strong>
                <small>Your saved stories</small>
              </div>
              <Icon name="arrow" />
            </Link>
            <Link href="/library">
              <span>
                <Icon name="bell" />
              </span>
              <div>
                <strong>
                  Following ({libraryState.followedStories.length})
                </strong>
                <small>Release notifications</small>
              </div>
              <Icon name="arrow" />
            </Link>
            <Link href="/library">
              <span>
                <Icon name="clock" />
              </span>
              <div>
                <strong>
                  History ({Object.keys(libraryState.progress).length})
                </strong>
                <small>Recently opened episodes</small>
              </div>
              <Icon name="arrow" />
            </Link>
          </aside>
        </section>

        <section className="reader-dashboard-section reader-updates">
          <div className="reader-section-title">
            <div>
              <Icon name="bell" />
              <span>
                <h2>Latest Releases</h2>
                <p>Fresh episodes available to read free.</p>
              </span>
            </div>
            <Link href="/discover">
              View all <Icon name="arrow" />
            </Link>
          </div>
          <div className="reader-update-grid">
            {stories.slice(0, 3).map((story) => {
              const latestEp = story.chapters[story.chapters.length - 1];
              return (
                <Link
                  href={
                    latestEp
                      ? `/read/${story.slug}/${latestEp.slug}`
                      : `/stories/${story.slug}`
                  }
                  key={story.slug}
                  className="reader-update-card"
                >
                  <Image
                    src={`/images/${story.image}.webp`}
                    alt=""
                    width={190}
                    height={110}
                  />
                  <div>
                    <strong>{story.title}</strong>
                    <span>
                      {latestEp ? latestEp.title : story.format}
                    </span>
                    <small>
                      {story.creatorDisplayName} · Free
                    </small>
                  </div>
                  <span className="reader-save">
                    <Icon name="play" size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="reader-dashboard-section reader-for-you">
          <div className="reader-section-title">
            <div>
              <Icon name="compass" />
              <span>
                <h2>For You</h2>
                <p>
                  {preferences?.genres.length
                    ? `Stories shaped around ${preferences.genres.slice(0, 3).join(", ")}.`
                    : "Curated African stories picked to begin your journey."}
                </p>
              </span>
            </div>
            <Link href="/discover">
              View all <Icon name="arrow" />
            </Link>
          </div>
          <div className="reader-recommendation-grid">
            {recommendations.map((story) => (
              <Link
                href={`/stories/${story.slug}`}
                key={story.slug}
                className="reader-recommendation-card"
              >
                <Image
                  src={`/images/${story.image}.webp`}
                  alt={`${story.title} artwork`}
                  fill
                  sizes="(max-width:700px) 80vw, 24vw"
                />
                <div className="reader-card-shade" />
                <span className="reader-card-arrow">
                  <Icon name="arrow" />
                </span>
                <div>
                  <h3>{story.title}</h3>
                  <p>
                    {story.genres.slice(0, 2).map((genre) => (
                      <span key={genre}>{genre}</span>
                    ))}
                  </p>
                  <small>
                    {story.format} · By {story.creatorDisplayName}
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="reader-discovery-strip">
          <div>
            <p className="eyebrow">A world beyond the next page</p>
            <h2>Find the story you’ll keep thinking about.</h2>
          </div>
          <Link href="/discover" className="button secondary">
            Explore all stories <Icon name="arrow" />
          </Link>
        </section>
      </div>
    </main>
  );
}
