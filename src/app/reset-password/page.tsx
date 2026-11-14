"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    if (password.length < 8) {
      setStatus("Password must be at least 8 characters.");
      setPending(false);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setStatus("Accounts aren't available right now.");
      setPending(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus(error.message);
      setPending(false);
      return;
    }
    setStatus("Password updated. Redirecting to your reader home…");
    window.setTimeout(() => router.push("/home"), 1200);
  }

  return (
    <main id="main" className="onboarding-page">
      <section className="onboarding-shell max-w-lg mx-auto space-y-5">
        <p className="eyebrow">Update Credentials</p>
        <h1 className="text-3xl font-bold">Choose a new password</h1>
        <form onSubmit={onSubmit} className="auth-form space-y-4">
          <div className="field-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="button primary w-full"
          >
            {pending ? "Saving…" : "Update password"}
          </button>
        </form>
        {status ? (
          <p className="auth-notice" role="status">
            {status}
          </p>
        ) : null}
        <Link href="/signin" className="text-link">
          Return to Sign In
        </Link>
      </section>
    </main>
  );
}
