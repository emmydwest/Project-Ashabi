"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppleIcon, GoogleIcon } from "@/components/icons/brand-icons";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignUp = mode === "signup";
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  async function handleSocial(provider: "google" | "apple") {
    setPending(true);
    setNotice("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl() },
    });
    if (error) {
      setNotice(error.message);
      setPending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const displayName = String(data.get("displayName") ?? "");
    const supabase = createClient();

    if (isSignUp) {
      const { data: result, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl(),
          data: { display_name: displayName },
        },
      });
      if (error) {
        setNotice(error.message);
        setPending(false);
        return;
      }
      if (result.session) {
        router.push("/onboarding");
      } else {
        setNotice("Check your email to confirm your account, then continue to Ashabi.");
        setPending(false);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setNotice(error.message);
      setPending(false);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <div className="auth-form-wrap">
      <div className="social-auth" aria-label="Social account options">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          disabled={pending}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          aria-label="Continue with Apple"
          onClick={() => handleSocial("apple")}
          disabled={pending}
        >
          <AppleIcon />
        </button>
      </div>

      <div className="auth-divider">
        <span>or continue with email</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="field-group">
            <label htmlFor="display-name">Display name</label>
            <input
              id="display-name"
              name="displayName"
              autoComplete="name"
              placeholder="How readers will know you"
              required
            />
          </div>
        )}
        <div className="field-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="password">Password</label>
            {!isSignUp && <Link href="/forgot-password">Forgot password?</Link>}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={8}
            placeholder={
              isSignUp ? "At least 8 characters" : "Enter your password"
            }
            required
          />
        </div>
        {isSignUp ? (
          <label className="check-row">
            <input type="checkbox" required />
            <span>
              I agree to the <Link href="/terms">Terms</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
        ) : (
          <label className="check-row">
            <input type="checkbox" name="remember" />
            <span>Keep me signed in</span>
          </label>
        )}
        <button className="button primary auth-submit" type="submit" disabled={pending}>
          {pending ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      {notice && (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      )}

      <p className="auth-switch">
        {isSignUp ? "Already have an account?" : "New to Ashabi?"}{" "}
        <Link href={isSignUp ? "/signin" : "/signup"}>
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
