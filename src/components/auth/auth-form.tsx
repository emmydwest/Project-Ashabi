"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons/brand-icons";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { signInSchema, signUpSchema } from "@/lib/validation";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignUp = mode === "signup";
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  async function handleGoogle() {
    setPending(true);
    setNotice("");
    const supabase = createClient();
    if (!supabase) {
      setNotice("Accounts aren't available right now.");
      setPending(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const displayName = String(data.get("displayName") ?? "").trim();
    const termsAccepted = data.get("terms") === "on";

    if (isSignUp) {
      const parsed = signUpSchema.safeParse({
        displayName,
        email,
        password,
        termsAccepted: termsAccepted ? true : false,
      });
      if (!parsed.success) {
        setNotice(parsed.error.issues[0]?.message ?? "Please check the form.");
        setPending(false);
        return;
      }

      const supabase = createClient();
      if (!supabase) {
        setNotice("Accounts aren't available right now.");
        setPending(false);
        return;
      }
      const { data: result, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: callbackUrl(),
          data: { display_name: parsed.data.displayName },
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
        setNotice(
          "Check your email to confirm your account, then continue to Ashabi.",
        );
        setPending(false);
      }
      return;
    }

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setNotice(parsed.error.issues[0]?.message ?? "Please check your credentials.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setNotice("Accounts aren't available right now.");
      setPending(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
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
          onClick={handleGoogle}
          disabled={pending}
          className="col-span-full"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="auth-divider">
        <span>or continue with email</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              placeholder={
                isSignUp ? "At least 8 characters" : "Enter your password"
              }
              required
              className="pr-11 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold-bright)] cursor-pointer p-1"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
            </button>
          </div>
        </div>
        {isSignUp ? (
          <label className="check-row">
            <input type="checkbox" name="terms" defaultChecked required />
            <span>
              I agree to the <Link href="/terms">Terms</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
        ) : (
          <label className="check-row">
            <input type="checkbox" name="remember" defaultChecked />
            <span>Keep me signed in</span>
          </label>
        )}
        <button
          className="button primary auth-submit"
          type="submit"
          disabled={pending}
        >
          {pending
            ? "Please wait…"
            : isSignUp
              ? "Create free account"
              : "Sign in"}
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
