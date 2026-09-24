import Link from "next/link";
export const metadata = { title: "Our story" };
export default function About() {
  return (
    <main id="main" className="page prose-page">
      <p className="eyebrow">The story behind Ashabi</p>
      <h1>A home for African imagination.</h1>
      <p>
        Ashabi is being built as a curated home for African comics, graphic
        novels, illustrated stories, and serialized fiction. A place to discover
        new voices, follow unfolding worlds, and return to the stories you love.
      </p>
      <h2>Stories come first.</h2>
      <p>
        Our starting point is simple: make it easy to find something worth
        reading. From a first chapter to a favourite creator, the experience
        should keep the work at its heart.
      </p>
      <h2>A first look at what is taking shape.</h2>
      <p>
        This preview introduces the visual direction and concept collection. The
        artwork and titles are sample material. They do not represent published
        books, live creator partnerships, or a catalogue currently open for
        reading.
      </p>
      <Link href="/discover" className="button primary">
        Explore the concept collection
      </Link>
    </main>
  );
}
