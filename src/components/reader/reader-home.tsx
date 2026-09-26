"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { stories } from "@/lib/stories";
import { createClient } from "@/lib/supabase/client";

type Preferences = { genres: string[]; formats: string[]; discovery: string[] };

export function ReaderHome() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [name, setName] = useState("Reader");

  useEffect(() => {
    const saved = sessionStorage.getItem("ashabi-preferences");
    if (saved) {
      try { setPreferences(JSON.parse(saved) as Preferences); } catch { setPreferences(null); }
    }
    createClient().auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      setName(String(user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Reader"));
      const remote = user.user_metadata?.preferences as Preferences | undefined;
      if (remote) {
        setPreferences(remote);
        sessionStorage.setItem("ashabi-preferences", JSON.stringify(remote));
      }
    });
  }, []);

  const recommendations = useMemo(() => {
    const matched = preferences?.genres.length
      ? stories.filter((story) => story.genres.some((genre) => preferences.genres.includes(genre)))
      : stories.slice(1);
    return [...matched, ...stories.filter((story) => !matched.includes(story))].slice(0, 4);
  }, [preferences]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const feature = stories[0];

  return (
    <main id="main" className="reader-dashboard">
      <div className="reader-city" aria-hidden="true"><Image src="/images/hero-afrofuturist-city.webp" alt="" fill priority sizes="100vw" /><span /></div>
      <div className="reader-orb" aria-hidden="true" />

      <div className="reader-dashboard-inner">
        <section className="reader-greeting">
          <div><h1>{greeting}, <span>{name}.</span></h1><p>New worlds are always waiting for you.</p></div>
          <p className="reader-mantra">Different stories.<br />Same human dreams.</p>
        </section>

        <section className="reader-primary-grid">
          <article className="reader-continue">
            <div className="reader-panel-title"><Icon name="book" /><h2>Continue Reading</h2></div>
            <div className="reader-feature">
              <Link href={`/stories/${feature.slug}`} className="reader-feature-art">
                <Image src={`/images/${feature.image}.webp`} alt={`${feature.title} artwork`} fill sizes="(max-width:900px) 100vw, 48vw" />
                <span>{feature.title}</span>
              </Link>
              <div className="reader-feature-copy">
                <div className="reader-tags">{feature.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
                <h3>{feature.title}</h3>
                <p className="reader-chapter">Your first chapter is waiting</p>
                <p>{feature.description}</p>
                <div className="reader-progress"><span style={{ width: "0%" }} /></div>
                <div className="reader-progress-label"><span>Ready to begin</span><strong>0%</strong></div>
                <div className="reader-feature-actions"><Link className="button primary" href={`/stories/${feature.slug}`}>Start Reading <Icon name="arrow" /></Link><button type="button" aria-label="Save story"><Icon name="bookmark" /></button></div>
              </div>
            </div>
          </article>

          <aside className="reader-library">
            <div className="reader-panel-title"><Icon name="book" /><h2>My Library</h2></div>
            <Link href="/profile"><span><Icon name="bookmark" /></span><div><strong>Saved</strong><small>Your saved stories</small></div><Icon name="arrow" /></Link>
            <Link href="/profile"><span><Icon name="heart" /></span><div><strong>Following</strong><small>Creators and stories</small></div><Icon name="arrow" /></Link>
            <Link href="/profile"><span><Icon name="clock" /></span><div><strong>History</strong><small>Your recently opened stories</small></div><Icon name="arrow" /></Link>
          </aside>
        </section>

        <section className="reader-dashboard-section reader-updates">
          <div className="reader-section-title"><div><Icon name="bell" /><span><h2>Latest Updates</h2><p>Fresh chapters and worlds to explore.</p></span></div><Link href="/discover">View all <Icon name="arrow" /></Link></div>
          <div className="reader-update-grid">
            {stories.slice(0, 3).map((story, index) => (
              <Link href={`/stories/${story.slug}`} key={story.slug} className="reader-update-card">
                <Image src={`/images/${story.image}.webp`} alt="" width={190} height={110} />
                <div><strong>{story.title}</strong><span>{index === 0 ? "Featured story" : story.format}</span><small>{story.genres.slice(0,2).join(" · ")}</small></div>
                <span className="reader-save"><Icon name="bookmark" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="reader-dashboard-section reader-for-you">
          <div className="reader-section-title"><div><Icon name="compass" /><span><h2>For You</h2><p>{preferences?.genres.length ? `Stories shaped around ${preferences.genres.slice(0,3).join(", ")}.` : "Stories picked to begin your journey."}</p></span></div><Link href="/discover">View all <Icon name="arrow" /></Link></div>
          <div className="reader-recommendation-grid">
            {recommendations.map((story) => (
              <Link href={`/stories/${story.slug}`} key={story.slug} className="reader-recommendation-card">
                <Image src={`/images/${story.image}.webp`} alt={`${story.title} artwork`} fill sizes="(max-width:700px) 80vw, 24vw" />
                <div className="reader-card-shade" />
                <span className="reader-card-arrow"><Icon name="arrow" /></span>
                <div><h3>{story.title}</h3><p>{story.genres.slice(0,2).map((genre) => <span key={genre}>{genre}</span>)}</p><small>{story.format}</small></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="reader-discovery-strip">
          <div><p className="eyebrow">A world beyond the next page</p><h2>Find the story you’ll keep thinking about.</h2></div>
          <Link href="/discover" className="button secondary">Explore all stories <Icon name="arrow" /></Link>
        </section>
      </div>
    </main>
  );
}
