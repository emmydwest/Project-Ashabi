"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="page prose-page">
      <h1>Something interrupted the story.</h1>
      <p>Please try loading this page again.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>{" "}
      <Link className="button secondary" href="/">
        Return home
      </Link>
    </main>
  );
}
