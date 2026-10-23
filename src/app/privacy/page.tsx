import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How Project Ashabi collects, uses, and protects reader data.",
};

export default function PrivacyPage() {
  return (
    <main id="main" className="page prose-page space-y-6">
      <p className="eyebrow">Privacy & Data Protection</p>
      <h1>Privacy Policy</h1>
      <p>
        Ashabi collects only the minimum data needed to operate accounts, save
        reading progress, send opted-in release updates, and understand which
        stories resonate with readers.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        Guests can read published episodes without creating an account. If you
        choose to sign up, we store your email address, display name, optional
        bio, genre preferences, and library actions (follows, saves, likes, and
        reading progress).
      </p>

      <h2>2. Analytics & Measurement</h2>
      <p>
        We record product events—such as story starts, episode completion
        checkpoints, and follows—to measure reader demand during our 90-day
        validation period. We do not sell personal data or expose private
        creator contact records.
      </p>

      <h2>3. Notification Consent & Account Deletion</h2>
      <p>
        You can disable release notifications at any time without deleting your
        account, or request full data export and account deletion via our{" "}
        <Link href="/help" className="text-[var(--gold-bright)] underline">
          Help & Support
        </Link>{" "}
        page.
      </p>
    </main>
  );
}
