import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Feather,
  Globe2,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
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
      className="relative min-h-screen overflow-hidden py-12 sm:py-20 px-4 sm:px-8"
    >
      {/* Subtle Ambient Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[960px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.14),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-10 w-[560px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.06),transparent_70%)] blur-3xl" />
      </div>

      <article className="max-w-4xl mx-auto space-y-12">
        {/* Top Liquid Glass Hero Header */}
        <header className="liquid-glass-gold rounded-[32px] p-8 sm:p-12 lg:p-14 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="neu-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--gold-bright)]">
              <Globe2 className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Early Development Preview</span>
            </span>

            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-glass-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold"
              >
                <Icon name="whatsapp" size={15} />
                <span>WhatsApp Founder</span>
              </a>
              <Link
                href="/?explore=1"
                className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold"
              >
                <span>Enter Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.05] m-0">
              Welcome to Project Ashabi
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--gold-bright)] m-0">
              African Stories. Limitless Worlds. A Global Future.
            </h2>
          </div>

          <p className="text-base sm:text-xl font-semibold text-[var(--ivory)] leading-relaxed m-0 pt-2 border-t border-white/10">
            Every great entertainment universe begins with a story. We believe
            the next generation of unforgettable stories, characters, and worlds
            can emerge from Africa.
          </p>

          <div className="space-y-4 text-sm sm:text-base text-[var(--text)] leading-relaxed">
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

        {/* Where We Are Today */}
        <section className="liquid-glass rounded-[28px] p-8 sm:p-11 space-y-5">
          <div className="flex items-center gap-3">
            <span className="neu-inset w-10 h-10 rounded-xl grid place-items-center text-[var(--gold-bright)]">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              Where We Are Today
            </h3>
          </div>

          <p className="text-base font-bold text-[var(--gold-bright)] m-0">
            Ashabi is currently under active development.
          </p>

          <div className="space-y-4 text-sm sm:text-base text-[var(--text)] leading-relaxed">
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
          </div>

          <div className="neu-inset rounded-[20px] p-5 sm:p-6 border border-[rgba(245,189,67,0.3)] flex gap-4 items-start">
            <ShieldCheck className="w-6 h-6 text-[var(--gold-bright)] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--ivory)] m-0">
              <strong className="text-[var(--gold-bright)] font-extrabold">
                Important:
              </strong>{" "}
              The comics and titles currently available through this integration
              are demonstration content for the reading experience. They should
              not be mistaken for Ashabi Originals or works created or owned by
              our team. Rights to third-party titles remain with their
              respective rights holders.
            </p>
          </div>

          <p className="text-sm sm:text-base font-semibold text-[var(--ivory)] m-0">
            This early version is only a starting point.
          </p>
        </section>

        {/* Two-Column: What We Hope to Build + Invitation */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="neu-card rounded-[28px] p-8 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <span className="neu-inset w-10 h-10 rounded-xl grid place-items-center text-[var(--gold-bright)]">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--text-strong)] m-0">
                What We Hope to Build
              </h3>
            </div>

            <div className="space-y-3.5 text-sm sm:text-base text-[var(--text)] leading-relaxed">
              <p className="m-0">
                Our journey begins with a digital platform for comics, graphic
                novels, and serialized illustrated stories.
              </p>
              <p className="m-0">
                From there, our vision is to develop a thriving creator
                community, support original African storytelling, identify
                promising intellectual properties, and eventually establish
                Ashabi Studios to bring selected stories to life through
                animation and other entertainment formats.
              </p>
              <p className="m-0">
                We want to create opportunities for talented individuals whose
                stories deserve to be discovered, regardless of where they come
                from.
              </p>
              <p className="text-base font-extrabold text-[var(--gold-bright)] pt-2 m-0">
                African in origin. Global in ambition. Open to creativity from
                everywhere.
              </p>
            </div>
          </section>

          <section className="neu-card rounded-[28px] p-8 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <span className="neu-inset w-10 h-10 rounded-xl grid place-items-center text-[var(--gold-bright)]">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--text-strong)] m-0">
                An Invitation to Creators, Investors &amp; Partners
              </h3>
            </div>

            <div className="space-y-3.5 text-sm sm:text-base text-[var(--text)] leading-relaxed">
              <p className="m-0">
                We&apos;re still at the beginning of this journey, and we
                recognize that building something of this scale requires
                talented people, strong partnerships, investment, and a
                community that believes in the vision.
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
              <p className="text-base font-extrabold text-[var(--ivory)] pt-1 m-0">
                You don&apos;t have to wait until Ashabi becomes something
                extraordinary to be part of its story.
              </p>
            </div>
          </section>
        </div>

        {/* A Message From the Founder */}
        <section className="liquid-glass-gold rounded-[28px] p-8 sm:p-11 space-y-5">
          <div className="flex items-center gap-3">
            <span className="neu-inset w-10 h-10 rounded-xl grid place-items-center text-[var(--gold-bright)]">
              <Feather className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
              A Message From the Founder
            </h3>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[var(--text)] leading-relaxed">
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
            <p className="text-lg font-extrabold text-[var(--gold-bright)] m-0">
              This is only the beginning.
            </p>
            <p className="text-base font-bold text-[var(--ivory)] pt-1 m-0">
              — The Founder, Project Ashabi
            </p>
          </div>

          {/* Primary Action Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/?explore=1"
              className="neu-pill-active inline-flex items-center justify-center gap-2.5 min-h-[54px] px-8 py-4 rounded-full text-sm sm:text-base font-extrabold"
            >
              <BookOpen className="w-5 h-5" />
              <span>Continue to Explore Ashabi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-glass-btn inline-flex items-center justify-center gap-2.5 min-h-[54px] px-8 py-4 rounded-full text-sm sm:text-base font-extrabold"
            >
              <Icon name="whatsapp" size={20} />
              <span>Contact the Founder on WhatsApp (+234 904 896 4270)</span>
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
