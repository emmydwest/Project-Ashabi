import Link from "next/link";
export const metadata = { title: "For creators" };
export default function Creators() {
  return (
    <main id="main" className="page prose-page">
      <p className="eyebrow">For the world-builders</p>
      <h1>Your stories belong here.</h1>
      <p>
        Writers, illustrators, comic artists, and storytellers: Ashabi is being
        built to help African creativity find its readers.
      </p>
      <h2>A curated publishing home.</h2>
      <p>
        The planned creator programme will let approved creators publish for
        free. Applications and work will be reviewed before publication.
      </p>
      <h2>Your work, your ownership.</h2>
      <p>
        Creators retain ownership unless a separate agreement states otherwise.
        Only work you have the rights to submit may be uploaded. Paid
        subscriptions, earnings, and payouts are outside this first version.
      </p>
      <div className="notice">
        <h2>Applications are not open yet.</h2>
        <p>
          This first look introduces Ashabi’s reading and discovery experience.
          Creator applications and the publishing studio are still to come.
        </p>
      </div>
      <Link href="/discover" className="text-link">
        Explore the concept collection →
      </Link>
    </main>
  );
}
