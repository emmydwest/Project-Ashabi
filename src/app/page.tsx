import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { StoryCard } from "@/components/story/story-card";
import { stories, genres } from "@/lib/stories";
export default function Home() {
  return (
    <main id="main" className="home-page">
      <section className="hero">
        <div className="hero-art">
          <Image
            src="/images/hero-afrofuturist-city.webp"
            alt="A woman overlooking an Afrofuturist city at sunset"
            fill
            priority
            sizes="(max-width:700px) 100vw, 75vw"
          />
        </div>
        <div className="hero-shade" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-reveal hero-delay-1">
            African stories. Global worlds.
          </p>
          <h1>
            <span className="hero-line hero-reveal hero-delay-2">Read.</span>
            <br />
            <span className="hero-line hero-reveal hero-delay-3">
              Discover.
            </span>
            <br />
            <span className="hero-line hero-gold hero-reveal hero-delay-4">
              Belong.
            </span>
          </h1>
          <p className="hero-description hero-reveal hero-delay-5">
            Comics, graphic novels, and extraordinary stories from Africa. Find
            a world that stays with you.
          </p>
          <div className="hero-actions hero-reveal hero-delay-6">
            <Link className="button primary" href="/discover">
              Start Exploring <Icon name="arrow" />
            </Link>
            <Link className="button glass-button" href="/signup">
              Join Ashabi
            </Link>
          </div>
          <div className="hero-note hero-reveal hero-delay-6">
            <span className="note-line" />A new home for African imagination
          </div>
        </div>
        <div className="hero-caption glass-panel">
          <span>01</span>
          DIFFERENT STORIES.
          <br />
          SAME HUMAN DREAMS.
        </div>
      </section>
      <div className="content">
        <nav className="genre-bar" aria-label="Browse genres">
          {genres.map((g, i) => (
            <Link
              key={g}
              className={"genre " + (i === 0 ? "selected" : "")}
              href={"/discover" + (i ? "?genre=" + encodeURIComponent(g) : "")}
            >
              <Icon name={i === 0 ? "grid" : "compass"} size={18} />
              {g}
            </Link>
          ))}
        </nav>
        <section className="feature reveal-card">
          <Image
            src="/images/featured-baobab.webp"
            alt="A traveller beneath an ancient baobab tree at sunset"
            fill
            sizes="(max-width:700px) 100vw, 90vw"
          />
          <div className="feature-shade" />
          <div className="feature-copy">
            <p className="eyebrow">Inside the concept collection</p>
            <h2>
              The Last <span>Baobab</span>
            </h2>
            <div className="tags">
              <span>Fantasy</span>
              <span>Adventure</span>
              <span>Drama</span>
            </div>
            <p>{stories[0].description}</p>
            <Link className="button primary" href="/stories/the-last-baobab">
              Explore the story <Icon name="arrow" />
            </Link>
          </div>
          <p className="feature-quote">
            Some roots
            <br />
            never die.
          </p>
        </section>
        <section className="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your next world awaits</p>
              <h2>Stories to get lost in</h2>
            </div>
            <Link href="/discover" className="text-link">
              Explore all <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="story-grid home-story-grid">
            {stories.slice(1).map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
          <p className="demo-note">
            A first look at Ashabi. These are concept titles and artwork, with
            no published chapters yet.
          </p>
        </section>
        <section className="ashabi-intro section-space">
          <div className="intro-statement">
            <p className="eyebrow">More than a shelf</p>
            <h2>
              A living home for <span>African imagination.</span>
            </h2>
            <p>
              Ashabi brings readers and creators together around stories with
              African roots and global ambition. Discover new worlds, follow the
              voices behind them, and return whenever the next chapter arrives.
            </p>
            <Link href="/about" className="text-link">
              The story behind Ashabi <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="intro-principles" aria-label="What Ashabi stands for">
            <article>
              <span className="principle-number">01</span>
              <div>
                <h3>Story first</h3>
                <p>Artwork, characters, and chapters lead every experience.</p>
              </div>
            </article>
            <article>
              <span className="principle-number">02</span>
              <div>
                <h3>African in origin</h3>
                <p>Rooted in many cultures, built to travel across borders.</p>
              </div>
            </article>
            <article>
              <span className="principle-number">03</span>
              <div>
                <h3>Creator powered</h3>
                <p>A curated platform where approved creators can grow.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="formats section-space">
          <div className="section-heading formats-heading">
            <div>
              <p className="eyebrow">Read it your way</p>
              <h2>One home. Many forms of story.</h2>
            </div>
            <p>
              From a vertical scroll to a quiet chapter of prose, each format
              gets space to feel natural.
            </p>
          </div>
          <div className="format-grid">
            <article className="format-card format-card-large">
              <Image
                src="/images/story-neon-lagos.webp"
                alt="Neon Lagos concept artwork"
                fill
                sizes="(max-width:700px) 100vw, 48vw"
              />
              <div className="format-overlay" />
              <div className="format-content">
                <span>01</span>
                <Icon name="book" size={28} />
                <h3>Comics & graphic novels</h3>
                <p>Page by page or in one uninterrupted vertical journey.</p>
              </div>
            </article>
            <article className="format-card">
              <Image
                src="/images/story-ashes-petals.webp"
                alt="Ashes and Petals concept artwork"
                fill
                sizes="(max-width:700px) 100vw, 24vw"
              />
              <div className="format-overlay" />
              <div className="format-content">
                <span>02</span>
                <h3>Illustrated stories</h3>
                <p>Words and images woven into a single world.</p>
              </div>
            </article>
            <article className="format-card format-card-prose">
              <div className="prose-mark">Aa</div>
              <div className="format-content">
                <span>03</span>
                <h3>Serialized fiction</h3>
                <p>
                  Read slowly, follow closely, and return for every chapter.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="reader-journey section-space">
          <div className="journey-copy">
            <p className="eyebrow">Built around the reader</p>
            <h2>Find a world. Stay for the journey.</h2>
            <p>
              Ashabi is designed to move from discovery to reading without
              getting in the story’s way.
            </p>
            <Link className="button primary" href="/discover">
              Find your next story <Icon name="arrow" />
            </Link>
          </div>
          <div className="journey-steps">
            <article>
              <Icon name="compass" size={24} />
              <div>
                <span>Discover</span>
                <p>Browse worlds by mood, genre, and voice.</p>
              </div>
            </article>
            <article>
              <Icon name="book" size={24} />
              <div>
                <span>Read</span>
                <p>A calm, cinematic home for every chapter.</p>
              </div>
            </article>
            <article>
              <Icon name="grid" size={24} />
              <div>
                <span>Return</span>
                <p>Keep your stories close and continue where you stopped.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="creator-banner reveal-card">
          <Image
            src="/images/creator-studio-art.webp"
            alt="An illustrator working on a story in a warmly lit studio"
            fill
            sizes="90vw"
          />
          <div className="feature-shade" />
          <div>
            <p className="eyebrow">Create. Share. Be seen.</p>
            <h2>Your stories belong here.</h2>
            <p>
              Writers, artists, and world-builders.
              <br />
              Help shape the next chapter of African storytelling.
            </p>
            <Link className="button secondary" href="/creators">
              Discover Ashabi for creators <Icon name="arrow" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
