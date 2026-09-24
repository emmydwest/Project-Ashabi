import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
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
      <div className="auth-actions" aria-label="Account actions">
        <Link href="/signin" className="auth-signin">
          Sign in
        </Link>
        <Link href="/signup" className="auth-signup">
          Sign up
        </Link>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <Link className="wordmark" href="/">
        ASHABI
      </Link>
      <p>Stories today. Iconic worlds tomorrow.</p>
      <Link href="/about">About Ashabi</Link>
      <span>Concept preview · Sample stories</span>
    </footer>
  );
}
