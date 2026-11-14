import { Suspense } from "react";
import { Catalog } from "@/components/story/catalog";
import { searchAniListCatalog, toAniListCard } from "@/lib/anilist";

export const metadata = { title: "Discover Manhwa, Manga & Comics" };
export const dynamic = "force-static";
export const revalidate = false;

export default async function Discover() {
  const initialItems = (await searchAniListCatalog({ perPage: 20 })).map((item) =>
    toAniListCard(item),
  );

  return (
    <main id="main" className="page space-y-6">
      <div>
        <p className="eyebrow">Live Discovery Engine</p>
        <h1>Discover Manhwa, Manga, Anime &amp; Comics</h1>
        <p className="page-intro">
          Search by title, filter across genres like Sci-Fi, Fantasy, Action,
          and Romance, or watch official promotional trailers.
        </p>
      </div>
      <Suspense
        fallback={
          <div aria-busy="true" className="py-12 text-center text-sm text-[var(--text-muted)]">
            Loading live catalog and filters…
          </div>
        }
      >
        <Catalog initialItems={initialItems} />
      </Suspense>
    </main>
  );
}
