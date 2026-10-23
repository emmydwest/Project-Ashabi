import Link from "next/link";
import { Icon } from "@/components/icons";

export const metadata = {
  title: "Our Story & Editorial Standards",
  description:
    "Project Ashabi's mission, editorial curation gates, and creator rights standards.",
};

export default function About() {
  return (
    <main id="main" className="page prose-page space-y-6">
      <p className="eyebrow">The story behind Ashabi</p>
      <h1>A curated home for African imagination.</h1>
      <p>
        Project Ashabi is a mobile-first digital publishing platform for African
        comics, graphic novels, illustrated stories, and serialized fiction.
        Built in Nigeria for readers across Africa, the diaspora, and the world,
        Ashabi connects readers with memorable worlds while giving creators
        editorial support, clear rights records, and honest readership data.
      </p>

      <h2>Free-to-read validation period</h2>
      <p>
        Every published story and episode on Ashabi is completely free to read
        during our initial MVP period. There are no paywalls, subscriptions, or
        paid chapters—and you do not need an account to start reading. Creating
        a free reader account simply lets you follow ongoing series, save
        stories to your library, and sync reading progress across devices.
      </p>

      <h2>Editorial standards & rights clarity</h2>
      <p>
        We distinguish clearly between three content layers:
      </p>
      <ul className="space-y-2 text-sm text-[var(--text)]">
        <li>
          <strong className="text-[var(--gold-bright)]">
            Creator-Published & Ashabi Curated Works:
          </strong>{" "}
          Published with written permission, verified rights records, and explicit
          creator credit. Creators retain copyright unless a separate written
          agreement states otherwise.
        </li>
        <li>
          <strong className="text-[var(--gold-bright)]">Free Library:</strong>{" "}
          Public-domain or openly licensed works verified for the relevant
          territory, with full source attribution.
        </li>
        <li>
          <strong className="text-[var(--gold-bright)]">
            External Discovery:
          </strong>{" "}
          Metadata and official links that send readers directly to the
          authorized publisher or platform—never unauthorized page copies.
        </li>
      </ul>

      <div className="notice">
        <h2>Questions or content reports?</h2>
        <p>
          Every episode includes a one-click Report option for formatting,
          suitability, or rights inquiries. Visit our Help & Reporting page for
          full details.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/discover" className="button primary">
            Explore the Catalog <Icon name="arrow" size={16} />
          </Link>
          <Link href="/help" className="button secondary">
            Help & Rights Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
