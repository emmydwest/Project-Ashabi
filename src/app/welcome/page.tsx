import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Feather, Globe2, Sparkles } from "lucide-react";
import { SafeImage as Image } from "@/components/ui/safe-image";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Welcome to Project Ashabi — African Stories. Limitless Worlds.",
  description:
    "Project Ashabi is an African-founded entertainment and intellectual-property venture discovering and developing extraordinary stories.",
};

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20just%20visited%20Project%20Ashabi%20and%20would%20love%20to%20connect.";

export default function WelcomePage() {
  return (
    <main id="main" className="relative min-h-screen pb-28 overflow-hidden">
      {/* Atmospheric Editorial Banner Backdrop (Unboxed, Fades into Page Canvas) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[540px] -z-10 overflow-hidden"
      >
        <Image
          src="/images/hero-ashabi-dawn.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-22 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/65 via-[#05070a]/90 to-[#05070a]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.12),transparent_70%)] blur-3xl" />
      </div>

      <article className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 space-y-20">
        {/* Top Masthead Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
            <Globe2 className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Early Development Preview · Built in Africa</span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Contact the Founder on WhatsApp (+234 904 896 4270)"
              className="whatsapp-glass-btn w-9 h-9 rounded-full grid place-items-center"
            >
              <Icon name="whatsapp" size={16} />
            </a>

            <Link
              href="/?explore=1"
              className="neu-pill-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold"
            >
              <span>Continue to Explore Ashabi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Editorial Title & Pull-Quote */}
        <header className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--gold)] m-0">
              Founder’s Manifesto · Issue 01
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.02] m-0">
              Welcome to Project Ashabi
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium italic text-[var(--gold-bright)] m-0">
              African Stories. Limitless Worlds. A Global Future.
            </h2>
          </div>

          <div className="lg:col-span-4 border-l-2 border-[var(--gold)]/60 pl-5 py-1">
            <p className="text-sm sm:text-base font-semibold text-[var(--ivory)] leading-relaxed m-0">
              &ldquo;Every great entertainment universe begins with a story. We
              believe the next generation of unforgettable stories, characters,
              and worlds can emerge from Africa.&rdquo;
            </p>
          </div>
        </header>

        {/* Open 4-Step Vision Strip (Unboxed Editorial Columns) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-y border-white/10 py-8">
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 01
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Digital Story Platform
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Comics, webtoons, graphic novels, and serialized illustrated
              fiction.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 02
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Creator Community
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Empowering writers, illustrators, and storytellers across Africa.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 03
            </span>
            <h3 className="text-base font-bold text-[var(--text-strong)] m-0">
              Ashabi Originals IP
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
              Original African mythology, sci-fi, fantasy, romance, and epics.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Stage 04
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
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              01 / The Mission
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              Beyond Another Comic Website
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
            <p className="m-0">
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
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              02 / Current Stage
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              Where We Are Today
            </h3>
            <p className="text-xs font-bold text-[var(--gold-bright)] m-0 pt-1">
              Ashabi is currently under active development.
            </p>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
              <p className="m-0 text-sm sm:text-base text-[var(--ivory)]">
                <strong className="text-[var(--gold-bright)] font-extrabold">
                  Important:
                </strong>{" "}
                The comics and titles currently available through this
                integration are demonstration content for the reading
                experience. They should not be mistaken for Ashabi Originals or
                works created or owned by our team. Rights to third-party titles
                remain with their respective rights holders.
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
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              03 / The Future
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              What We Hope to Build
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              04 / Join the Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              An Invitation to Creators, Investors &amp; Partners
            </h3>
          </div>

          <div className="md:col-span-8 space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
            <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--gold)] block">
              05 / Sign-Off
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              A Message From the Founder
            </h3>
          </div>

          <div className="md:col-span-8 space-y-6 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
              <p className="font-serif text-2xl font-bold text-[var(--gold-bright)] m-0">
                This is only the beginning.
              </p>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--ivory)] m-0 pt-1 flex items-center gap-2">
                <Feather className="w-4 h-4 text-[var(--gold)]" />
                <span>The Founder, Project Ashabi</span>
              </p>
            </div>

            {/* Compact Action Bar + Circular WhatsApp Icon */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/?explore=1"
                  className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Continue to Explore Ashabi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Contact the Founder on WhatsApp"
                  title="Contact the Founder on WhatsApp (+234 904 896 4270)"
                  className="whatsapp-glass-btn w-9 h-9 rounded-full grid place-items-center"
                >
                  <Icon name="whatsapp" size={17} />
                </a>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs italic text-[var(--text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>
                  Early Development Preview · Built in Africa · Created for the
                  World
                </span>
              </span>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
