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
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/88 backdrop-blur-xl"
        >
          <div className="liquid-glass max-w-sm w-full rounded-2xl p-6 space-y-4 border border-[#ff6b6b]/30 text-center">
            <div className="mx-auto w-11 h-11 rounded-xl bg-[#ff6b6b]/15 border border-[#ff6b6b]/35 grid place-items-center text-[#ff7b7b]">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#ff8a8a] bg-[#ff6b6b]/12 border border-[#ff6b6b]/25">
              <Flame className="w-3 h-3" />
              <span>18+ Restricted Catalogue</span>
            </div>

            <h2
              id="mature-age-gate-title"
              className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-strong)] m-0"
            >
              Age Verification (18+)
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed m-0">
              This section contains mature Manhwa and Manga intended strictly
              for adult readers (18+). Confirm your age to continue.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setVerified(true)}
                className="neu-pill-active px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer"
              >
                I Am 18+ — Enter
              </button>

              <button
                type="button"
                onClick={() => router.push("/?explore=1")}
                className="neu-pill px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--ivory)] cursor-pointer"
              >
                Leave
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
