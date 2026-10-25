import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <main
      id="main"
      className="relative min-h-screen py-16 sm:py-24 px-6 sm:px-12 lg:px-20"
    >
      {/* Subtle Ambient Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[960px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.10),transparent_70%)] blur-3xl" />
      </div>

      {/* Open Full-Page Editorial Layout (No Boxes) */}
      <article className="max-w-4xl mx-auto space-y-16">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold-bright)]">
            Early Development Preview · Built in Africa
          </span>

          <div className="flex items-center gap-2.5">
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

            <Link
              href="/?explore=1"
              className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            >
              <span>Continue to Explore Ashabi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Heading & Opening Statement */}
        <header className="space-y-6">
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.08] m-0">
              Welcome to Project Ashabi
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--gold-bright)] m-0">
              African Stories. Limitless Worlds. A Global Future.
            </h2>
          </div>

          <p className="text-lg sm:text-xl font-bold text-[var(--ivory)] leading-relaxed m-0">
            Every great entertainment universe begins with a story. We believe
            the next generation of unforgettable stories, characters, and worlds
            can emerge from Africa.
          </p>

          <div className="space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
            <p className="m-0">
              Project Ashabi is an African-founded entertainment and
              intellectual-property venture with a mission to discover, develop,
              and bring extraordinary stories and creative talent to audiences
              around the world.
            </p>
            <p className="m-0">
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
        </header>

        <hr className="border-white/10" />

        {/* Where We Are Today */}
        <section className="space-y-5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
            Where We Are Today
          </h3>

          <p className="text-base sm:text-lg font-bold text-[var(--gold-bright)] m-0">
            Ashabi is currently under active development.
          </p>

          <div className="space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
            <p className="m-0 text-[var(--ivory)]">
              <strong className="text-[var(--gold-bright)] font-extrabold">
                Important:
              </strong>{" "}
              The comics and titles currently available through this integration
              are demonstration content for the reading experience. They should
              not be mistaken for Ashabi Originals or works created or owned by
              our team. Rights to third-party titles remain with their
              respective rights holders.
            </p>
            <p className="m-0 font-semibold text-[var(--ivory)]">
              This early version is only a starting point.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* What We Hope to Build */}
        <section className="space-y-5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
            What We Hope to Build
          </h3>

          <div className="space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
            <p className="text-lg font-bold text-[var(--gold-bright)] m-0">
              African in origin. Global in ambition. Open to creativity from
              everywhere.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* An Invitation to Creators, Investors & Partners */}
        <section className="space-y-5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
            An Invitation to Creators, Investors &amp; Partners
          </h3>

          <div className="space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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

        {/* A Message From the Founder */}
        <section className="space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
            A Message From the Founder
          </h3>

          <div className="space-y-5 text-base sm:text-lg text-[var(--text)] leading-[1.85]">
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
            <p className="text-lg font-bold text-[var(--gold-bright)] m-0">
              This is only the beginning.
            </p>
            <p className="text-base font-bold text-[var(--ivory)] m-0">
              — The Founder, Project Ashabi
            </p>
          </div>

          <hr className="border-white/10 my-6" />

          {/* Sleek Action Row + Compact WhatsApp Icon */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/?explore=1"
              className="neu-pill-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold"
            >
              <span>Continue to Explore Ashabi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Contact the Founder on WhatsApp (+234 904 896 4270)"
              className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center"
            >
              <Icon name="whatsapp" size={18} />
            </a>
          </div>

          <p className="text-xs sm:text-sm italic text-[var(--text-muted)] m-0 pt-2">
            Early Development Preview · Built in Africa · Created for the World
          </p>
        </section>
      </article>
    </main>
  );
}
