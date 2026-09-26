import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { AccountNav } from "@/components/auth/account-nav";
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
        <Link href="/creators">For creators</Link>
        <Link href="/about">Our story</Link>
      </nav>
      <Link
        href="/discover"
        className="header-search"
        aria-label="Search stories"
      >
        <Icon name="search" />
        <span>Find your next story</span>
      </Link>
      <AccountNav />
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link className="wordmark" href="/">ASHABI</Link>
        <p>A home for African stories, unforgettable characters, and worlds without borders.</p>
      </div>
      <div className="footer-links"><strong>Explore</strong><Link href="/discover">Discover</Link><Link href="/creators">Creators</Link><Link href="/about">Our story</Link></div>
      <div className="footer-links"><strong>Your Ashabi</strong><Link href="/home">Reader home</Link><Link href="/profile">Profile</Link><Link href="/onboarding">Preferences</Link></div>
      <div className="footer-statement"><span>Different stories.</span><span>Same human dreams.</span></div>
      <div className="footer-bottom"><span>© 2026 Ashabi</span><span>Stories today. Iconic worlds tomorrow.</span></div>
    </footer>
  );
}
