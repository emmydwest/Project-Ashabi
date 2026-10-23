"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

type Preferences = { genres?: string[]; formats?: string[]; discovery?: string[] };

export function ReaderProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return <main className="route-loading"><p>Preparing your profile…</p></main>;

  const metadata = user.user_metadata;
  const name = String(metadata.display_name || metadata.full_name || user.email?.split("@")[0] || "Ashabi Reader");
  const handle = `@${String(metadata.username || user.email?.split("@")[0] || "reader").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()}`;
  const bio = String(metadata.bio || "A reader, a dreamer, and part of a growing world of African stories.");
  const preferences = (metadata.preferences || {}) as Preferences;
  const genres = preferences.genres?.length ? preferences.genres : ["Choose your genres"];
  const joined = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(user.created_at));

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const display_name = String(data.get("displayName") || name).trim();
    const nextBio = String(data.get("bio") || "").trim();
    const { data: result, error } = await createClient().auth.updateUser({ data: { display_name, bio: nextBio } });
    if (error) setMessage(error.message);
    else {
      setUser(result.user);
      setEditing(false);
      setMessage("Profile updated.");
    }
    setSaving(false);
  }

  return (
    <main id="main" className="profile-page">
      <section className="profile-banner">
        <Image src="/images/hero-afrofuturist-city.webp" alt="A golden futuristic African city" fill priority sizes="100vw" />
        <div className="profile-banner-shade" />
        <div className="profile-heading"><p className="eyebrow">Your place in Ashabi</p><h1>My <span>Profile</span></h1><p>A reader, a dreamer, a part of something greater.</p></div>
        <p className="profile-motto">Different stories.<br />Same human dreams.</p>
      </section>

      <div className="profile-layout">
        <div className="profile-main-column">
          <section className="profile-card">
            <div className="profile-avatar-wrap">
              <Image src="/images/hero-character-city-alt.webp" alt="Profile portrait" fill sizes="180px" />
              <span>{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="profile-identity">
              <h2>{name}</h2><p className="profile-handle">{handle}</p><p>{bio}</p>
              <div className="profile-meta"><span>Reader account</span><span>Joined {joined}</span></div>
            </div>
            <button type="button" className="button secondary profile-edit" onClick={() => setEditing(!editing)}><Icon name="edit" /> Edit profile</button>
          </section>

          {editing && (
            <form className="profile-edit-form" onSubmit={saveProfile}>
              <label>Display name<input name="displayName" defaultValue={name} maxLength={40} required /></label>
              <label>About you<textarea name="bio" defaultValue={bio} maxLength={180} rows={3} /></label>
              <div><button type="button" className="button secondary" onClick={() => setEditing(false)}>Cancel</button><button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div>
            </form>
          )}
          {message && <p className="profile-message" role="status">{message}</p>}

          <section className="profile-stats" aria-label="Reading activity">
            <article><Icon name="bookmark" /><strong>0</strong><span>Stories saved</span></article>
            <article><Icon name="user" /><strong>0</strong><span>Creators followed</span></article>
            <article><Icon name="flame" /><strong>0</strong><span>Day streak</span></article>
            <article><Icon name="book" /><strong>0</strong><span>Chapters read</span></article>
          </section>

          <section className="profile-shortcuts">
            <Link href="/discover"><span><Icon name="bookmark" /></span><div><h3>My Library</h3><p>Your saved stories will appear here.</p></div><Icon name="arrow" /></Link>
            <Link href="/discover"><span><Icon name="clock" /></span><div><h3>Reading History</h3><p>Stories you open will appear here.</p></div><Icon name="arrow" /></Link>
            <Link href="/discover"><span><Icon name="heart" /></span><div><h3>Liked Stories</h3><p>Your favourites will appear here.</p></div><Icon name="arrow" /></Link>
          </section>

          <section className="profile-empty-reads">
            <div><p className="eyebrow">Recent reads</p><h2>Your next world starts here.</h2><p>Open a story and your reading journey will begin to take shape.</p></div>
            <Link className="button primary" href="/discover">Discover stories <Icon name="arrow" /></Link>
          </section>
        </div>

        <aside className="profile-rail">
          <section><div className="profile-rail-heading"><h2>Favorite Genres</h2><Link href="/onboarding">Edit</Link></div><div className="profile-genre-list">{genres.map((genre) => <span key={genre}>{genre}</span>)}</div><blockquote>“Good stories make a brighter tomorrow.”</blockquote></section>
          <section><div className="profile-rail-heading"><h2>Favorite Creators</h2></div><div className="profile-rail-empty"><Icon name="user" size={32} /><p>Follow creators you love and they’ll appear here.</p><Link href="/creators">Meet creators</Link></div></section>
          <section className="profile-account-card"><h2>Account</h2><p>{user.email}</p><button type="button" onClick={() => createClient().auth.signOut().then(() => { router.push("/"); router.refresh(); })}><Icon name="logout" /> Sign out</button></section>
        </aside>
      </div>
    </main>
  );
}
