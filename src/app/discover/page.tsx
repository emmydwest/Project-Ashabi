import { Suspense } from "react";
import { Catalog } from "@/components/story/catalog";
import { stories } from "@/lib/stories";
import { StoryCard } from "@/components/story/story-card";
export const metadata = { title: "Discover" };
export default function Discover() {
  return (
    <main id="main" className="page">
      <p className="eyebrow">Find your next world</p>
      <h1>Discover stories</h1>
      <p className="page-intro">
        From future cities to ancient worlds. Explore the Ashabi concept
        collection.
      </p>
      <Suspense
        fallback={
          <div aria-busy="true">
            <p role="status">Loading search and filters…</p>
            <div className="story-grid">
              {stories.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </div>
        }
      >
        <Catalog />
      </Suspense>
    </main>
  );
}
