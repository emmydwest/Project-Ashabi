"use client";

import { useEffect } from "react";

/**
 * Strips `?explore=1` from the browser URL bar after the home hub mounts
 * so that reloading the page (F5 / Cmd+R) or returning to the site always
 * hits `/` and routes back to `/welcome` (the Founder's Message).
 */
export function ResetWelcomeOnReload() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/" &&
      window.location.search.includes("explore=1")
    ) {
      const hash = window.location.hash || "";
      window.history.replaceState(null, "", `/${hash}`);
    }
  }, []);

  return null;
}
