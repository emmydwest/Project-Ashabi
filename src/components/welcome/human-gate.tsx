"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { HUMAN_OK_COOKIE_NAME, isSafeRelativePath } from "@/lib/human-check";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type GateState = "unknown" | "verified" | "challenge" | "checking" | "error";

const HumanContext = createContext<{
  verified: boolean;
  ready: boolean;
  focusGate: () => void;
  state: GateState;
  error: string | null;
  widgetRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
}>({
  verified: false,
  ready: false,
  focusGate: () => {},
  state: "unknown",
  error: null,
  widgetRef: { current: null },
  cardRef: { current: null },
});

function hasOkCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${HUMAN_OK_COOKIE_NAME}=1`));
}

export function HumanGateProvider({
  siteKey,
  children,
}: {
  siteKey: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cookieVerified = useSyncExternalStore(
    () => () => {},
    hasOkCookie,
    () => false,
  );
  const [state, setState] = useState<GateState>(
    cookieVerified ? "verified" : "challenge",
  );
  const [error, setError] = useState<string | null>(null);
  const safeNext = isSafeRelativePath(searchParams.get("next"));

  const focusGate = useCallback(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const complete = useCallback(
    async (token: string) => {
      setState("checking");
      setError(null);
      try {
        const response = await fetch("/api/human/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = (await response.json()) as { ok?: boolean; error?: string };
        if (!response.ok || !data.ok) {
          setState("error");
          setError(data.error ?? "Verification failed. Please try again.");
          if (widgetId.current && window.turnstile) {
            window.turnstile.reset(widgetId.current);
          }
          return;
        }
        setState("verified");
        if (safeNext) router.replace(safeNext);
      } catch {
        setState("error");
        setError("Something went wrong. Please try again.");
      }
    },
    [router, safeNext],
  );

  useEffect(() => {
    if (cookieVerified || state !== "challenge" || !siteKey || !widgetRef.current) {
      return;
    }

    let cancelled = false;

    function renderWidget() {
      if (cancelled || !widgetRef.current || !window.turnstile) return;
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "dark",
        size: "flexible",
        appearance: "always",
        callback: (token: string) => {
          void complete(token);
        },
        "error-callback": () => {
          setState("error");
          setError("The check could not load. Refresh and try again.");
        },
        "expired-callback": () => {
          setState("challenge");
          setError("The check expired. Please verify again.");
        },
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else if (!document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = () => {
        if (!cancelled) {
          setState("error");
          setError("The check could not load. Refresh and try again.");
        }
      };
      document.head.appendChild(script);
    } else {
      document
        .getElementById("cf-turnstile-script")
        ?.addEventListener("load", renderWidget);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [cookieVerified, state, siteKey, complete]);

  const verified = state === "verified" || cookieVerified;
  const ready = true;

  return (
    <HumanContext.Provider
      value={{
        verified,
        ready,
        focusGate,
        state,
        error,
        widgetRef,
        cardRef,
      }}
    >
      {children}
    </HumanContext.Provider>
  );
}

export function HumanCheckCard() {
  const { verified, state, error, widgetRef, cardRef } = useContext(HumanContext);

  return (
    <div
      ref={cardRef}
      id="human-check"
      className="liquid-glass rounded-[24px] px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-gold)] bg-[var(--gold)]/10 text-[var(--gold-bright)]">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold-bright)] m-0">
            Reader check
          </p>
          <p className="text-sm text-[var(--text)] m-0">
            {verified
              ? "You're verified. Enjoy the catalogue — we won't ask again on this device."
              : "A quick one-time check keeps the catalogue open for real readers."}
          </p>
          {error ? (
            <p className="text-xs text-[#ff8a8a] m-0" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      {verified ? (
        <span className="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#68e3ab] bg-[#12281e]/80 border border-[#68e3ab]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </span>
      ) : (
        <div className="relative min-h-[65px] min-w-[280px] sm:min-w-[300px] flex items-center justify-center">
          {state === "checking" ? (
            <span className="absolute inset-0 z-10 grid place-items-center bg-[#05070a]/60 rounded-xl text-xs font-bold text-[var(--gold-bright)]">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming…
              </span>
            </span>
          ) : null}
          <div ref={widgetRef} className="w-full" />
        </div>
      )}
    </div>
  );
}

export function ExploreLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { verified, ready, focusGate } = useContext(HumanContext);

  if (!ready || verified) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={focusGate}
      aria-describedby="human-check"
    >
      {children}
    </button>
  );
}
