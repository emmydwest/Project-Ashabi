import Image from "next/image";

export default function Loading() {
  return (
    <main
      id="main"
      aria-busy="true"
      className="min-h-[78vh] flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="relative flex items-center justify-center w-24 h-24 mb-7">
        {/* Outer Rotating Gold Orbit Ring */}
        <div
          aria-hidden="true"
          className="ashabi-orbit-ring absolute inset-0 rounded-full border border-dashed border-[var(--gold)]/45"
        />
        {/* Inner Pulsing Gold Aura */}
        <div
          aria-hidden="true"
          className="ashabi-pulse-crest absolute inset-2 rounded-full border border-[var(--gold-bright)]/35 bg-[rgba(245,189,67,0.06)]"
        />
        {/* Ashabi Crest Logo */}
        <div className="relative z-10 w-12 h-12 grid place-items-center">
          <Image
            src="/images/ashabi-logo.png"
            alt="Project Ashabi"
            width={44}
            height={44}
            priority
            unoptimized
            className="object-contain"
          />
        </div>
      </div>

      <div role="status" className="space-y-3 max-w-xs w-full">
        <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-[var(--gold-bright)] m-0">
          PROJECT ASHABI
        </p>
        <p className="font-serif text-lg text-[var(--ivory)] m-0">
          African Stories. Limitless Worlds.
        </p>

        {/* Animated Gold Progress Sweep */}
        <div className="h-[2px] w-44 mx-auto rounded-full bg-white/10 overflow-hidden mt-3">
          <div className="ashabi-progress-bar h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--gold-bright)] to-transparent" />
        </div>
      </div>
    </main>
  );
}
