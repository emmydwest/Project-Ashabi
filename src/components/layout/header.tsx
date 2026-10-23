import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { AccountNav } from "@/components/auth/account-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function Header() {
  return (
    <header className="header">
      <Link href="/" className="brand" aria-label="Ashabi home">
        <Image src="/images/ashabi-logo.png" alt="" width={56} height={56} />
        <span>ASHABI</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/discover">Discover</Link>
        <Link href="/library">Library</Link>
        <Link href="/creators">Creators</Link>
        <Link href="/about">Our story</Link>
      </nav>
      <Link
        href="/discover"
        className="header-search"
        aria-label="Search stories"
      >
        <Icon name="search" />
        <span>Search stories, creators, genres…</span>
      </Link>
      <AccountNav />
    </header>
  );
}

export function Footer() {
  return (
    <>
      <footer className="footer pb-24 md:pb-14">
        <div className="footer-brand">
          <Link className="wordmark" href="/">
            ASHABI
          </Link>
          <p>
            A curated, free-to-read home for African comics, graphic novels,
            illustrated stories, and serialized fiction.
          </p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          <Link href="/discover">Discover Catalog</Link>
          <Link href="/creators">Creators</Link>
          <Link href="/library">My Library</Link>
          <Link href="/home">Reader Home</Link>
        </div>
        <div className="footer-links">
          <strong>Trust & Governance</strong>
          <Link href="/about">Editorial Standards</Link>
          <Link href="/help">Help & Reporting</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-statement">
          <span>Different stories.</span>
          <span>Same human dreams.</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Project Ashabi · All published MVP stories are free to read</span>
          <span>Nigeria · Africa · Global</span>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
