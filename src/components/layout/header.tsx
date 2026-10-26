import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Compass,
  Feather,
  Flame,
  Home,
  Users,
} from "lucide-react";
import { Icon } from "@/components/icons";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const WHATSAPP_URL =
  "https://wa.me/2349048964270?text=Hello%2C%20I%20just%20visited%20Project%20Ashabi%20and%20would%20love%20to%20connect.";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05070a]/80 backdrop-blur-2xl">
      <div className="max-w-[1480px] mx-auto h-20 px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo */}
        <Link
          href="/?explore=1"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="Ashabi home"
        >
          <div className="neu-inset w-11 h-11 rounded-2xl p-1.5 grid place-items-center border border-white/10 group-hover:border-[var(--border-gold)] transition-colors">
            <Image
              src="/images/ashabi-logo.png"
              alt=""
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-extrabold tracking-[0.28em] text-[var(--ivory)]">
            ASHABI
          </span>
        </Link>

        {/* Primary Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-1 neu-inset p-1.5 rounded-full"
        >
          <Link
            href="/?explore=1"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--text)] hover:text-[var(--gold-bright)] hover:bg-white/[0.04] transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Comics Hub</span>
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--text)] hover:text-[var(--gold-bright)] hover:bg-white/[0.04] transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Discover</span>
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--text)] hover:text-[var(--gold-bright)] hover:bg-white/[0.04] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Books &amp; Novels</span>
          </Link>
          <Link
            href="/mature"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[#ff8a8a] hover:text-[#ffb4b4] hover:bg-white/[0.04] transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff6b6b]" />
            <span>18+ Hub</span>
          </Link>
          <Link
            href="/creators"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--text)] hover:text-[var(--gold-bright)] hover:bg-white/[0.04] transition-all"
          >
            <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Creators</span>
          </Link>
          <Link
            href="/welcome"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-[var(--gold-bright)] bg-[rgba(245,189,67,0.1)] border border-[rgba(245,189,67,0.25)] hover:bg-[rgba(245,189,67,0.18)] transition-all"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Founder’s Note</span>
          </Link>
        </nav>

        {/* Search + Compact Icon-Only WhatsApp Button */}
        <div className="flex items-center gap-2.5 flex-1 justify-end max-w-md">
          <HeaderSearch />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact the Founder on WhatsApp"
            title="Contact the Founder on WhatsApp (+234 904 896 4270)"
            className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center shrink-0"
          >
            <Icon name="whatsapp" size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <>
      <footer className="footer pb-24 md:pb-14">
        <div className="footer-brand">
          <Link className="wordmark" href="/?explore=1">
            ASHABI
          </Link>
          <p>
            An African-founded digital publishing platform for comics, graphic
            novels, illustrated stories, and serialized fiction.
          </p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          <Link href="/?explore=1">Comics &amp; Manhwa Hub</Link>
          <Link href="/discover">Discover Catalog</Link>
          <Link href="/books">Books &amp; Novels Catalogue</Link>
          <Link href="/mature">18+ Mature Catalogue</Link>
          <Link href="/creators">Creators Studio</Link>
        </div>
        <div className="footer-links">
          <strong>Legal &amp; Governance</strong>
          <Link href="/welcome">Founder’s Welcome Page</Link>
          <Link href="/terms">Terms &amp; DMCA Safe Harbor</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/cookies">Cookie &amp; Consent Policy</Link>
          <Link href="/about">Editorial Standards</Link>
        </div>
        <div className="footer-statement">
          <span>African Stories.</span>
          <span>Limitless Worlds.</span>
          <div className="pt-3 flex items-center md:justify-end">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact the Founder on WhatsApp"
              title="Contact the Founder on WhatsApp (+234 904 896 4270)"
              className="whatsapp-glass-btn w-10 h-10 rounded-full grid place-items-center shrink-0"
            >
              <Icon name="whatsapp" size={18} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 Project Ashabi · Built in Africa · Created for the World
          </span>
          <span>Nigeria · Africa · Global</span>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
