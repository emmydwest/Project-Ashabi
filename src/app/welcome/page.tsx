import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Feather,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import { Icon } from "@/components/icons";
import {
  ExploreLink,
  HumanCheckCard,
  HumanGateProvider,
} from "@/components/welcome/human-gate";

export const metadata: Metadata = {
  title: "Welcome to Project Ashabi — African Stories. Limitless Worlds.",
  description:
    "Project Ashabi is an African-founded entertainment and intellectual-property venture discovering and developing extraordinary stories.",
};

export const dynamic = "force-static";
export const revalidate = false;

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20just%20visited%20Project%20Ashabi%20and%20would%20love%20to%20connect.";

export default function WelcomePage() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <main id="main" className="relative min-h-screen pb-28 overflow-hidden">
      <Suspense fallback={null}>
      <HumanGateProvider siteKey={siteKey}>
      {/* Atmospheric Editorial Banner Backdrop (Unboxed, Fades Seamlessly into Canvas) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[620px] -z-10 overflow-hidden"
      >
        <Image
          src="/images/hero-ashabi-dawn.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-24 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/55 via-[#05070a]/88 to-[#05070a]" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[960px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.14),transparent_70%)] blur-3xl" />
      </div>

      <article className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 space-y-20">
        {/* Top Masthead Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
              <Globe2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Founder’s Edition · Lagos, Nigeria · Global</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Active Development Preview
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Contact the Founder on WhatsApp (+234 904 896 4270)"
              className="whatsapp-glass-btn"
            >
              <Icon name="whatsapp" size={16} />
            </a>

            <ExploreLink
              href="/?explore=1"
              className="neu-pill-active inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </ExploreLink>
          </div>
        </div>

        {/* Hero Editorial Title & Pull-Quote */}
        <header className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--gold)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder’s Manifesto · Issue 01</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.02] m-0">
              Welcome to Project Ashabi
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium italic text-[var(--gold-bright)] m-0">
              African Stories. Limitless Worlds. A Global Future.
            </h2>
          </div>

          <div className="lg:col-span-4 border-l-2 border-[var(--gold)]/70 pl-5 py-1 space-y-2">
            <p className="font-serif text-lg sm:text-xl italic font-semibold text-[var(--ivory)] leading-relaxed m-0">
              &ldquo;Every great entertainment universe begins with a story. We
              believe the next generation of unforgettable stories, characters,
              and worlds can emerge from Africa.&rdquo;
            </p>
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
              — Founding Vision Statement
            </span>
          </div>
        </header>

        <HumanCheckCard />

        {/* Visual Triptych Gallery: The Worlds We Are Building */}
        <section
          aria-label="Visual vision showcase"
          className="grid sm:grid-cols-3 gap-6"
        >
          <figure className="m-0 space-y-2.5 group">
            <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden border border-white/10">
              <Image
                src="/images/hero-afrofuturist-city.webp"
                alt="Afrofuturist metropolis at golden hour"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                I · Afrofuturist Worlds
              </span>
            </div>
            <figcaption className="text-xs text-[var(--text-muted)] leading-relaxed px-0.5">
              Visionary science fiction, cyber-noir action, and speculative
              futures rooted in African cities.
            </figcaption>
          </figure>

          <figure className="m-0 space-y-2.5 group">
            <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden border border-white/10">
              <Image
                src="/images/story-the-last-baobab.webp"
                alt="Sacred baobab tree illuminated at twilight"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                II · Mythic Folklore &amp; Epics
              </span>
            </div>
            <figcaption className="text-xs text-[var(--text-muted)] leading-relaxed px-0.5">
              Ancient kingdoms, ancestral memory, and high-fantasy sagas told on
              an international scale.
            </figcaption>
          </figure>

          <figure className="m-0 space-y-2.5 group">
            <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden border border-white/10">
              <Image
                src="/images/story-neon-lagos.webp"
                alt="Sequential comic character under neon rain"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                III · Future Animation &amp; Studios
              </span>
            </div>
            <figcaption className="text-xs text-[var(--text-muted)] leading-relaxed px-0.5">
              Developing original intellectual property designed to evolve into
              animation, film, series, and games.
            </figcaption>
          </figure>
        </section>

        {/* Open 4-Step Vision Roadmap (Unboxed Architectural Columns) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-y border-white/10 py-8">
          <div className="space-y-1.5 border-l border-[var(--gold)]/40 pl-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 01 · Foundation
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Digital Story Platform
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Comics, webtoons, graphic novels, and serialized illustrated
              fiction.
            </p>
          </div>

          <div className="space-y-1.5 border-l border-[var(--gold)]/40 pl-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 02 · Ecosystem
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Creator Community
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Empowering writers, illustrators, and storytellers across Africa.
            </p>
          </div>

          <div className="space-y-1.5 border-l border-[var(--gold)]/40 pl-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 03 · Original IP
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Ashabi Originals
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Original African mythology, sci-fi, fantasy, romance, and epics.
            </p>
          </div>

          <div className="space-y-1.5 border-l border-[var(--gold)]/40 pl-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 04 · Screen &amp; Beyond
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Ashabi Studios
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Adapting standout stories into animation, film, series, and games.
            </p>
          </div>
        </div>

        {/* Section 01: The Ambition */}
        <section className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="font-serif text-4xl font-bold text-[var(--gold)]/35 block leading-none">
              01
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              The Mission
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              Beyond Another Comic Website
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.88]">
            <p className="m-0 first-letter:float-left first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--gold-bright)] first-letter:pr-3 first-letter:leading-none">
              Project Ashabi is an African-founded entertainment and
              intellectual-property venture with a mission to discover, develop,
              and bring extraordinary stories and creative talent to audiences
              around the world.
            </p>
            <p className="m-0 font-semibold text-[var(--ivory)]">
              Our ambition goes far beyond creating another comic-reading
              website.
            </p>
            <p className="m-0">
              We envision an ecosystem where writers, illustrators, comic
              artists, and storytellers can share their creativity, build
              communities, reach international audiences, and potentially see
              their stories evolve into animation, television series, films,
              games, and other entertainment experiences.
            </p>
            <p className="m-0">
              From African mythology and historical epics to science fiction,
              fantasy, romance, action, horror, and entirely new fictional
              universes, we believe African creators have the imagination to
              build stories that resonate globally.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Section 02: Where We Are Today */}
        <section className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="font-serif text-4xl font-bold text-[var(--gold)]/35 block leading-none">
              02
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              Current Stage
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              Where We Are Today
            </h3>
            <p className="text-xs font-bold text-[var(--gold-bright)] m-0 pt-1">
              Ashabi is currently under active development.
            </p>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.88]">
            <p className="m-0">
              We&apos;re building this vision from the ground up with limited
              personal funding, working progressively to turn an ambitious idea
              into a functioning platform.
            </p>
            <p className="m-0">
              We are not yet a fully funded entertainment company or an
              established animation studio. What you&apos;re seeing is an
              early-stage product being developed with the resources presently
              available to us.
            </p>
            <p className="m-0">
              To allow visitors, creators, and potential investors to experience
              our vision in action, we&apos;ve integrated a third-party content
              API into the platform.
            </p>

            <div className="border-l-2 border-[var(--gold-bright)] pl-5 py-1 space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--gold-bright)]">
                <ShieldCheck className="w-4 h-4" />
                <span>Important Third-Party Content Disclosure</span>
              </div>
              <p className="m-0 text-sm sm:text-base text-[var(--ivory)]">
                The comics, novels, and titles currently available through this
                third-party integration are demonstration content for the
                reading experience. They should not be mistaken for Ashabi
                Originals or works created or owned by our team. Rights to
                third-party titles remain with their respective rights holders.
              </p>
            </div>

            <p className="m-0 font-semibold text-[var(--ivory)]">
              This early version is only a starting point.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Section 03: What We Hope to Build */}
        <section className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="font-serif text-4xl font-bold text-[var(--gold)]/35 block leading-none">
              03
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              The Future
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              What We Hope to Build
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.88]">
            <p className="m-0">
              Our journey begins with a digital platform for comics, graphic
              novels, and serialized illustrated stories.
            </p>
            <p className="m-0">
              From there, our vision is to develop a thriving creator community,
              support original African storytelling, identify promising
              intellectual properties, and eventually establish Ashabi Studios
              to bring selected stories to life through animation and other
              entertainment formats.
            </p>
            <p className="m-0">
              We want to create opportunities for talented individuals whose
              stories deserve to be discovered, regardless of where they come
              from.
            </p>
            <p className="font-serif text-xl sm:text-2xl italic font-bold text-[var(--gold-bright)] m-0 pt-1">
              African in origin. Global in ambition. Open to creativity from
              everywhere.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Section 04: An Invitation to Creators, Investors & Partners */}
        <section className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="font-serif text-4xl font-bold text-[var(--gold)]/35 block leading-none">
              04
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              Join the Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              An Invitation to Creators, Investors &amp; Partners
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.88]">
            <p className="m-0">
              We&apos;re still at the beginning of this journey, and we
              recognize that building something of this scale requires talented
              people, strong partnerships, investment, and a community that
              believes in the vision.
            </p>
            <p className="m-0">
              If you&apos;re a writer, illustrator, comic artist, animator, or
              storyteller interested in becoming an early Ashabi creator,
              we&apos;d love to hear from you.
            </p>
            <p className="m-0">
              If you&apos;re an angel investor, venture capitalist, fellow
              founder, studio, publisher, or potential strategic partner who
              sees the opportunity in African storytelling and entertainment,
              we&apos;re open to conversations.
            </p>
            <p className="m-0">
              We&apos;re building with determination, transparency, and a
              long-term vision.
            </p>
            <p className="text-lg font-bold text-[var(--ivory)] m-0">
              You don&apos;t have to wait until Ashabi becomes something
              extraordinary to be part of its story.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* Section 05: A Message From the Founder */}
        <section className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-2">
            <span className="font-serif text-4xl font-bold text-[var(--gold)]/35 block leading-none">
              05
            </span>
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              Sign-Off
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              A Message From the Founder
            </h3>
          </div>

          <div className="md:col-span-8 space-y-6 text-base sm:text-lg text-[var(--text)] leading-[1.88]">
            <p className="m-0">
              Ashabi is being built because we believe African creativity
              deserves the opportunity to reach the world on its own terms.
            </p>
            <p className="m-0">
              Our resources may be limited today, but our ambition is not. Every
              feature, every improvement, and every step forward brings us
              closer to building the ecosystem we envision.
            </p>
            <p className="m-0">
              Thank you for taking the time to discover Ashabi at this early
              stage.
            </p>
            <div className="pt-2 space-y-1">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[var(--gold-bright)] m-0">
                This is only the beginning.
              </p>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--ivory)] m-0 pt-1.5 flex items-center gap-2">
                <Feather className="w-4 h-4 text-[var(--gold)]" />
                <span>The Founder, Project Ashabi</span>
              </p>
            </div>

            {/* Compact Action Bar + Circular WhatsApp Icon */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <ExploreLink
                  href="/?explore=1"
                  className="neu-pill-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Continue to Explore Ashabi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </ExploreLink>

                <ExploreLink
                  href="/books"
                  className="neu-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
                  <span>Books &amp; Novels</span>
                </ExploreLink>

                <ExploreLink
                  href="/discover"
                  className="neu-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[var(--ivory)]"
                >
                  <Compass className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
                  <span>Discover Catalogue</span>
                </ExploreLink>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[var(--text-muted)]">
                  Connect on WhatsApp:
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contact the Founder on WhatsApp"
                  title="Contact the Founder on WhatsApp (+234 904 896 4270)"
                  className="whatsapp-glass-btn"
                >
                  <Icon name="whatsapp" size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </article>
      </HumanGateProvider>
      </Suspense>
    </main>
  );
}
