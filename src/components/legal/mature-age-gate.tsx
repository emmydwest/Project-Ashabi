"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, ShieldAlert } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function MatureAgeGate({ children }: Props) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  return (
    <>
      {!verified ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mature-age-gate-title"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
        >
          <div className="liquid-glass max-w-md w-full rounded-[28px] p-7 sm:p-8 space-y-5 border border-[#ff6b6b]/35 shadow-[0_32px_90px_rgba(0,0,0,0.95)] text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#ff6b6b]/15 border border-[#ff6b6b]/40 grid place-items-center text-[#ff7b7b]">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-[#ff8a8a] bg-[#ff6b6b]/15 border border-[#ff6b6b]/30">
              <Flame className="w-3.5 h-3.5" />
              <span>18+ Restricted Catalogue</span>
            </div>

            <h2
              id="mature-age-gate-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-strong)] m-0"
            >
              Age Verification Required
            </h2>

            <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed m-0">
              This section contains mature Manhwa, Manga, and graphic fiction
              intended strictly for adult readers (18+). Please confirm that you
              are at least 18 years of age to continue.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setVerified(true)}
                className="neu-pill-active px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer"
              >
                I Am 18 or Older — Enter
              </button>

              <button
                type="button"
                onClick={() => router.push("/?explore=1")}
                className="neu-pill px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[var(--ivory)] cursor-pointer"
              >
                Under 18 — Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={!verified ? "blur-xl pointer-events-none select-none" : ""}>
        {children}
      </div>
    </>
  );
}
