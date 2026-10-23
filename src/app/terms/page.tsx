import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using the Project Ashabi website MVP.",
};

export default function TermsPage() {
  return (
    <main id="main" className="page prose-page space-y-6">
      <p className="eyebrow">Legal & Trust</p>
      <h1>Terms of Service</h1>
      <p>
        Welcome to Project Ashabi. By browsing or creating an account on Ashabi,
        you agree to use the platform respectfully and in accordance with these
        MVP beta terms.
      </p>

      <h2>1. Free Beta Access</h2>
      <p>
        Ashabi currently provides free reader access to curated comics, graphic
        novels, illustrated stories, and serialized fiction. Free reader access
        does not transfer copyright or grant permission to redistribute,
        scrape, or republish hosted artwork or text outside Ashabi.
      </p>

      <h2>2. Creator Ownership & Attribution</h2>
      <p>
        Creators retain ownership of their submitted works unless a separate
        written agreement states otherwise. Ashabi displays public labels to
        distinguish Creator-Published works, Ashabi Concept previews, Free
        Library public-domain works, and External Discovery metadata links.
      </p>

      <h2>3. Reader Accounts & Conduct</h2>
      <p>
        You are responsible for maintaining the security of your account
        credentials. Abuse of reporting forms, automated scraping, or attempts
        to access unpublished assets may result in account suspension.
      </p>

      <Link href="/privacy" className="text-link">
        Read our Privacy Policy →
      </Link>
    </main>
  );
}
