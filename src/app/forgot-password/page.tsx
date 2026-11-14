"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/icons";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const supabase = createClient();
    if (!supabase) {
      setStatus("Accounts aren't available right now.");
      setPending(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setStatus(error.message);
    } else {
      setStatus(
        "If an account exists for that email, a password reset link has been sent.",
      );
    }
    setPending(false);
  }

  return (
    <main id="main" className="onboarding-page">
      <section className="onboarding-shell max-w-lg mx-auto space-y-5">
        <Link href="/signin" className="text-link">
          <Icon name="arrow-left" size={16} /> Back to Sign In
        </Link>
        <p className="eyebrow">Account Recovery</p>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Enter the email address connected to your Ashabi account and we’ll
          send a recovery link.
        </p>

        <form onSubmit={onSubmit} className="auth-form space-y-4">
          <div className="field-group">
            <label htmlFor="reset-email">Email address</label>
            <input
              id="reset-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="button primary w-full"
          >
            {pending ? "Sending link…" : "Send reset link"}
          </button>
        </form>

        {status ? (
          <p className="auth-notice" role="status">
            {status}
          </p>
        ) : null}
      </section>
    </main>
  );
}
