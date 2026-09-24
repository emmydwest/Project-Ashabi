import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page prose-page">
      <p className="eyebrow">A page beyond this world</p>
      <h1>We couldn’t find that page.</h1>
      <p>
        The link may have changed. There are more worlds waiting in Discover.
      </p>
      <Link href="/discover" className="button primary">
        Back to Discover
      </Link>
    </main>
  );
}
