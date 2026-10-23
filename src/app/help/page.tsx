import Link from "next/link";

export const metadata = {
  title: "Help, Rights & Reporting",
  description:
    "Guidance on reading free stories, managing your Ashabi account, rights verification, and reporting content.",
};

export default function HelpPage() {
  return (
    <main id="main" className="page prose-page space-y-6">
      <p className="eyebrow">Support & Governance</p>
      <h1>Help, Rights & Reporting</h1>
      <p>
        Ashabi is designed to be simple, fast, and transparent for both readers
        and creators. Below are answers to common questions during our MVP beta.
      </p>

      <h2>Reading & Free Access</h2>
      <p>
        All published stories and episodes on Ashabi are free to read without
        payment, subscriptions, or checkout steps. You can read any episode as a
        guest or sign in to save your progress and follow stories for release
        updates.
      </p>

      <h2>Creator Credit & Takedown Requests</h2>
      <p>
        No work is published on Ashabi without an internal rights checklist
        recording the owner or rightsholder, permission basis, creator credit,
        and territory. If you believe any work or attribution on Ashabi requires
        correction or removal, use the <strong>Report</strong> button inside any
        episode reader to log a priority moderation record.
      </p>

      <h2>Account Privacy, Export & Deletion</h2>
      <p>
        You can update your display name, bio, and genre preferences at any time
        from your <Link href="/profile" className="text-[var(--gold-bright)] underline">Profile</Link>.
        To request a full data export or permanent account deletion, submit a
        request from your profile settings and our administrator team will
        process it promptly.
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/discover" className="button primary">
          Browse Free Stories
        </Link>
        <Link href="/privacy" className="button secondary">
          Privacy Policy
        </Link>
      </div>
    </main>
  );
}
