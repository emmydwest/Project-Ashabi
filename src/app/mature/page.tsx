import type { Metadata } from "next";
import { Suspense } from "react";
import { MatureAgeGate } from "@/components/legal/mature-age-gate";
import { MatureCatalogue } from "@/components/story/mature-catalogue";
import { getAniListMatureCatalog, toAniListCard } from "@/lib/anilist";

export const metadata: Metadata = {
  title: "18+ Mature Catalogue — Project Ashabi",
  description:
    "Age-restricted 18+ Manhwa and Manga catalogue on Project Ashabi. Requires 18+ age verification.",
};

export const dynamic = "force-static";
export const revalidate = false;

export default async function MatureCataloguePage() {
  const [adult, dark] = await Promise.all([
    getAniListMatureCatalog({ mode: "ADULT_18" }),
    getAniListMatureCatalog({ mode: "DARK_SEINEN" }),
  ]);

  return (
    <main
      id="main"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 pb-24"
    >
      <MatureAgeGate>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              Loading the 18+ catalogue…
            </div>
          }
        >
          <MatureCatalogue
            adultItems={adult.map((item) => toAniListCard(item))}
            darkItems={dark.map((item) => toAniListCard(item))}
          />
        </Suspense>
      </MatureAgeGate>
    </main>
  );
}
