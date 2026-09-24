"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryCard } from "@/components/story/story-card";
import { stories } from "@/lib/stories";
import { createClient } from "@/lib/supabase/client";

type Preferences = { genres: string[]; formats: string[]; discovery: string[] };

export function ReaderHome() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("ashabi-preferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved) as Preferences);
      } catch {
        setPreferences(null);
      }
    }
    createClient().auth.getUser().then(({ data }) => {
      const remote = data.user?.user_metadata?.preferences as Preferences | undefined;
      if (remote) {
        setPreferences(remote);
        sessionStorage.setItem("ashabi-preferences", JSON.stringify(remote));
      }
    });
  }, []);

  const recommended = preferences?.genres.length
    ? stories.filter((story) =>
        story.genres.some((genre) => preferences.genres.includes(genre)),
      )
    : stories.slice(1);
  const visibleRecommendations = (
    recommended.length ? recommended : stories
  ).slice(0, 4);

  return (
    <main id="main" className="reader-home">
      <section className="reader-welcome">
        <div>
          <p className="eyebrow">Your reader home</p>
          <h1>Welcome to Ashabi.</h1>
          <p>
            {preferences?.genres.length
              ? `Your home is tuned for ${preferences.genres.slice(0, 3).join(", ")}.`
              : "Discover a world and make this space your own."}
          </p>
        </div>
        <Link href="/discover" className="button secondary">
          Discover stories <Icon name="arrow" />
        </Link>
      </section>

      <section className="continue-card">
        <Image
          src="/images/featured-baobab.webp"
          alt="The Last Baobab concept artwork"
          fill
          priority
          sizes="(max-width:700px) 100vw, 70vw"
        />
        <div className="continue-overlay" />
        <div className="continue-content">
          <p className="eyebrow">Start your first story</p>
          <h2>The Last Baobab</h2>
          <p>
            A young girl, a sacred tree, and the memories of a forgotten era.
          </p>
          <div className="continue-actions">
            <Link className="button primary" href="/stories/the-last-baobab">
              View story <Icon name="arrow" />
            </Link>
            <span>Concept preview · No chapters yet</span>
          </div>
        </div>
      </section>

      <section className="reader-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Chosen for you</p>
            <h2>Explore your kind of story</h2>
          </div>
          <Link href="/onboarding" className="text-link">
            Tune preferences
          </Link>
        </div>
        <div className="story-grid">
          {visibleRecommendations.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>

      <section className="reader-quick-grid">
        <article>
          <Icon name="book" size={26} />
          <div>
            <h3>Your library</h3>
            <p>Saved and followed stories will appear here.</p>
          </div>
          <span>Empty</span>
        </article>
        <article>
          <Icon name="compass" size={26} />
          <div>
            <h3>Latest updates</h3>
            <p>New chapters from followed creators will appear here.</p>
          </div>
          <span>None yet</span>
        </article>
        <article>
          <Icon name="grid" size={26} />
          <div>
            <h3>Reading history</h3>
            <p>Your recently opened stories will appear here.</p>
          </div>
          <span>Empty</span>
        </article>
      </section>
    </main>
  );
}
