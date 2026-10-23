"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";

const DISMISSED_KEY = "ashabi:founder-welcome-ack:v3";
const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20just%20visited%20Project%20Ashabi%20and%20would%20love%20to%20connect.";

export function AshabiPreviewNotice() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      return window.sessionStorage.getItem(DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });

  // Lock background body scroll while full-page welcome screen is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleContinue() {
    setIsOpen(false);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore storage errors
    }
  }

  return (
    <>
      {/* Persistent Top Bar After Continuing */}
      <div
        role="region"
        aria-label="Project Ashabi founder message and WhatsApp contact"
        className="rounded-full border border-[rgba(245,189,67,0.34)] bg-[#0b1117]/95 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[var(--gold)] text-[#140c02] shrink-0">
            Early Development Preview
          </span>
          <span className="text-[var(--ivory)] truncate">
            <strong className="text-[var(--gold-bright)]">Project Ashabi</strong>{" "}
            · Built in Africa · Created for the World (Demo catalog powered by
            third-party API)
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-[var(--border-gold)] bg-[rgba(245,189,67,0.14)] text-[var(--gold-bright)] hover:bg-[rgba(245,189,67,0.26)] transition-all cursor-pointer"
          >
            <Icon name="book" size={13} />
            <span>Founder’s Welcome Note</span>
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#25D366] text-[#041b0c] hover:brightness-110 transition-all"
          >
            <Icon name="comment" size={13} />
            <span>WhatsApp Founder</span>
          </a>
        </div>
      </div>

      {/* Full-Page Welcome Experience (Appears First on Load) */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ashabi-fullpage-welcome-title"
          className="fixed inset-0 z-[160] overflow-y-auto bg-[#05070a] text-[var(--text)] animate-[fadeIn_240ms_ease-out]"
        >
          {/* Ambient Atmospheric Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(245,189,67,0.16),transparent_70%)] blur-2xl" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.07),transparent_70%)] blur-2xl" />
          </div>

          {/* Sticky Top Bar inside the Full-Page Welcome View */}
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#05070a]/90 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/ashabi-logo.png"
                  alt="Project Ashabi"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <span className="font-extrabold tracking-widest text-sm text-[var(--text-strong)] block leading-none">
                    PROJECT ASHABI
                  </span>
                  <span className="text-[11px] text-[var(--gold-bright)] font-semibold">
                    Early Development Preview
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold bg-[#25D366] text-[#041b0c] hover:brightness-110 transition-all"
                >
                  <Icon name="comment" size={14} />
                  <span>Contact on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold bg-[var(--gold)] text-[#140c02] hover:bg-[var(--gold-bright)] transition-all cursor-pointer"
                >
                  <span>Continue to Explore Ashabi</span>
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Full-Page Letter Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
            {/* Hero Title Header */}
            <header className="space-y-4 border-b border-[rgba(245,189,67,0.25)] pb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[rgba(245,189,67,0.16)] text-[var(--gold-bright)] border border-[var(--border-gold)]">
                <Icon name="sparkles" size={14} />
                <span>Founder’s Vision &amp; Preview Briefing</span>
              </div>

              <h1
                id="ashabi-fullpage-welcome-title"
                className="font-serif text-4xl sm:text-6xl font-bold text-[var(--text-strong)] tracking-tight leading-[1.06] m-0"
              >
                Welcome to Project Ashabi
              </h1>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--gold-bright)] m-0">
                African Stories. Limitless Worlds. A Global Future.
              </h2>

              <p className="text-base sm:text-lg font-bold text-[var(--ivory)] leading-relaxed m-0 pt-2">
                Every great entertainment universe begins with a story. We
                believe the next generation of unforgettable stories,
                characters, and worlds can emerge from Africa.
              </p>
            </header>

            {/* Intro Narrative */}
            <section className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text)]">
              <p className="m-0">
                Project Ashabi is an African-founded entertainment and
                intellectual-property venture with a mission to discover,
                develop, and bring extraordinary stories and creative talent to
                audiences around the world.
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
            </section>

            {/* Section: Where We Are Today */}
            <section className="rounded-[24px] border border-[rgba(245,189,67,0.34)] bg-gradient-to-b from-[#0d151e] to-[#080d12] p-6 sm:p-8 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
                Where We Are Today
              </h3>
              <p className="text-sm sm:text-base font-bold text-[var(--gold-bright)] m-0">
                Ashabi is currently under active development.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text)] m-0">
                We&apos;re building this vision from the ground up with limited
                personal funding, working progressively to turn an ambitious
                idea into a functioning platform.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text)] m-0">
                We are not yet a fully funded entertainment company or an
                established animation studio. What you&apos;re seeing is an
                early-stage product being developed with the resources presently
                available to us.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--text)] m-0">
                To allow visitors, creators, and potential investors to
                experience our vision in action, we&apos;ve integrated a
                third-party content API into the platform.
              </p>

              <div className="rounded-[16px] border border-[rgba(245,189,67,0.45)] bg-[rgba(245,189,67,0.08)] p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-[var(--ivory)]">
                <strong className="text-[var(--gold-bright)] font-extrabold">
                  Important:
                </strong>{" "}
                The comics and titles currently available through this
                integration are demonstration content for the reading
                experience. They should not be mistaken for Ashabi Originals or
                works created or owned by our team. Rights to third-party titles
                remain with their respective rights holders.
              </div>

              <p className="text-sm sm:text-base font-semibold text-[var(--ivory)] m-0">
                This early version is only a starting point.
              </p>
            </section>

            {/* Section: What We Hope to Build */}
            <section className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text)]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
                What We Hope to Build
              </h3>
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
              <p className="text-base sm:text-lg font-extrabold text-[var(--gold-bright)] m-0">
                African in origin. Global in ambition. Open to creativity from
                everywhere.
              </p>
            </section>

            {/* Section: An Invitation to Creators, Investors & Partners */}
            <section className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text)]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
                An Invitation to Creators, Investors &amp; Partners
              </h3>
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
              <p className="text-base sm:text-lg font-extrabold text-[var(--ivory)] m-0">
                You don&apos;t have to wait until Ashabi becomes something
                extraordinary to be part of its story.
              </p>
            </section>

            {/* Section: A Message From the Founder */}
            <section className="rounded-[24px] border border-[rgba(245,189,67,0.3)] bg-gradient-to-br from-[#121820] to-[#070a0e] p-6 sm:p-8 space-y-4 text-sm sm:text-base leading-relaxed">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0">
                A Message From the Founder
              </h3>
              <p className="m-0">
                Ashabi is being built because we believe African creativity
                deserves the opportunity to reach the world on its own terms.
              </p>
              <p className="m-0">
                Our resources may be limited today, but our ambition is not.
                Every feature, every improvement, and every step forward brings
                us closer to building the ecosystem we envision.
              </p>
              <p className="m-0">
                Thank you for taking the time to discover Ashabi at this early
                stage.
              </p>
              <p className="text-base sm:text-lg font-extrabold text-[var(--gold-bright)] m-0">
                This is only the beginning.
              </p>
              <p className="text-sm sm:text-base font-bold text-[var(--ivory)] pt-2 m-0">
                — The Founder, Project Ashabi
              </p>
            </section>

            <hr className="border-[var(--border)]" />

            {/* Action Buttons & Footer Tagline */}
            <footer className="space-y-6 pb-10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="button primary justify-center text-sm sm:text-base px-7 py-4 cursor-pointer"
                >
                  <Icon name="play" size={18} />
                  <span>Continue to Explore Ashabi</span>
                </button>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 py-3.5 rounded-full text-sm sm:text-base font-extrabold bg-[#25D366] text-[#041b0c] shadow-[0_12px_30px_rgba(37,211,102,0.3)] hover:brightness-110 transition-all"
                >
                  <Icon name="comment" size={18} />
                  <span>Contact the Founder on WhatsApp (+234 904 896 4270)</span>
                </a>
              </div>

              <p className="text-xs sm:text-sm italic text-[var(--text-muted)] m-0">
                Early Development Preview · Built in Africa · Created for the
                World
              </p>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
