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
      const supabase = createClient();
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          if (exchangeError.message.toLowerCase().includes("code verifier")) {
            setError("This confirmation link was created before Ashabi’s sign-in fix. Please create your account again to receive a new link.");
          } else {
            setError(exchangeError.message);
          }
          return;
        }
      }

      // Implicit confirmation and social-login results are restored from the
      // URL hash when the browser client is created.
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (!data.session) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        setError(
          hash.get("error_description") ??
            "This confirmation link is invalid or has expired. Please create your account again to receive a fresh link.",
        );
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
