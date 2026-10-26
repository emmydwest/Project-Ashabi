"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";

export function CookieResetButton() {
  const [done, setDone] = useState(false);

  function handleReset() {
    try {
      localStorage.removeItem("ashabi_cookie_consent_v1");
      localStorage.removeItem("ashabi_mature_verified_18");
      localStorage.removeItem("ashabi_african_platform_notice_seen_v2");
      localStorage.removeItem("ashabi_preferred_lang");
      setDone(true);
      setTimeout(() => setDone(false), 3500);
    } catch {
      // ignore storage errors
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold bg-[var(--gold-bright)] text-[#070a0f] hover:bg-[#ffd26a] transition-colors cursor-pointer"
      >
        {done ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Local Consent &amp; Preferences Cleared</span>
          </>
        ) : (
          <>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset My Consent &amp; Local Storage Keys</span>
          </>
        )}
      </button>
      {done ? (
        <span className="text-xs text-[var(--gold-bright)]">
          All local consent keys have been cleared from your browser.
        </span>
      ) : null}
    </div>
  );
}
