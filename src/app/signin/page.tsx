import Image from "next/image";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main id="main" className="auth-page">
      <section className="auth-art">
        <Image
          src="/images/hero-character-city-alt.webp"
          alt="A hero looking over a luminous African city"
          fill
          priority
          sizes="(max-width:800px) 100vw, 52vw"
        />
        <div className="auth-art-overlay" />
        <div className="auth-art-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Return to the worlds waiting for you.</h1>
          <p>
            Your library, followed creators, and reading progress will live
            here.
          </p>
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="signin-title">
        <div className="auth-panel-inner">
          <p className="eyebrow">Reader access</p>
          <h2 id="signin-title">Sign in to Ashabi</h2>
          <p className="auth-lead">
            Continue your stories and discover what arrived while you were away.
          </p>
          <AuthForm mode="signin" />
        </div>
      </section>
    </main>
  );
}
