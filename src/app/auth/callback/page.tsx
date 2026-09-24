"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishSignIn() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await createClient().auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data } = await createClient().auth.getSession();
      if (!data.session) {
        setError("We could not complete your sign in. Please try again.");
        return;
      }

      const completed = Boolean(data.session.user.user_metadata?.onboarding_complete);
      router.replace(completed ? "/home" : "/onboarding");
    }

    finishSignIn();
  }, [router]);

  return (
    <main id="main" className="onboarding-page">
      <section className="onboarding-shell auth-callback-card">
        <p className="eyebrow">Ashabi account</p>
        <h1>{error ? "Sign in needs another try" : "Opening your story world…"}</h1>
        {error && (
          <>
            <p className="auth-notice" role="alert">{error}</p>
            <Link className="button primary" href="/signin">Return to sign in</Link>
          </>
        )}
      </section>
    </main>
  );
}
