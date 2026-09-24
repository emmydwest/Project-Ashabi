import Image from "next/image";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <main id="main" className="auth-page auth-page-signup">
      <section className="auth-art">
        <Image
          src="/images/hero-afrofuturist-city.webp"
          alt="An Afrofuturist city glowing at sunset"
          fill
          priority
          sizes="(max-width:800px) 100vw, 52vw"
        />
        <div className="auth-art-overlay" />
        <div className="auth-art-copy">
          <p className="eyebrow">Your next chapter</p>
          <h1>Discover stories that feel close to home.</h1>
          <p>
            Follow new worlds, save your favourites, and always know where you
            stopped.
          </p>
        </div>
      </section>
      <section className="auth-panel" aria-labelledby="signup-title">
        <div className="auth-panel-inner">
          <p className="eyebrow">Join the community</p>
          <h2 id="signup-title">Create your account</h2>
          <p className="auth-lead">
            Start as a reader. You can apply to become a creator later.
          </p>
          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}
