"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  defaultActive?: boolean;
}

export function ReaderModeToggle({ defaultActive = false }: Props) {
  const [active, setActive] = useState<boolean>(defaultActive);

  useEffect(() => {
    if (active) {
      document.body.classList.add("ashabi-reader-mode");
    } else {
      document.body.classList.remove("ashabi-reader-mode");
    }
    return () => {
      document.body.classList.remove("ashabi-reader-mode");
    };
  }, [active]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && active) {
        setActive(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        title="Reader Mode hides all site navigation tabs, headers, and toolbars so only the story remains on screen"
        className={
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer " +
          (active
            ? "neu-pill-active"
            : "neu-pill text-[var(--gold-bright)] border-[var(--border-gold)]")
        }
      >
        {active ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Exit Reader Mode</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5 text-[var(--gold-bright)]" />
            <span>Reader Mode</span>
          </>
        )}
      </button>

      {active && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed bottom-5 right-5 z-[140] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(false)}
                className="neu-pill-active inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold shadow-[0_12px_35px_rgba(0,0,0,0.85)] cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Exit Reader Mode (Show Tabs)</span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
