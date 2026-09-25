"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Icon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export function AccountNav() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => {
      data.subscription.unsubscribe();
      document.removeEventListener("pointerdown", close);
    };
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (user === undefined) return <div className="account-nav-loading" aria-hidden="true" />;

  if (!user) {
    return (
      <div className="auth-actions" aria-label="Account actions">
        <Link href="/signin" className="auth-signin">Sign in</Link>
        <Link href="/signup" className="auth-signup">Sign up</Link>
      </div>
    );
  }

  const name = String(user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Reader");
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="account-nav" ref={menuRef}>
      <Link href="/home" className="account-home" aria-label="Reader home">
        <Icon name="bell" />
      </Link>
      <button className="account-chip" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="account-avatar">{initial}</span>
        <span className="account-name">{name}</span>
        <span className={open ? "account-caret open" : "account-caret"}>⌄</span>
      </button>
      {open && (
        <div className="account-menu">
          <Link href="/profile" onClick={() => setOpen(false)}><Icon name="user" /> My profile</Link>
          <Link href="/home" onClick={() => setOpen(false)}><Icon name="book" /> Reader home</Link>
          <button type="button" onClick={signOut}><Icon name="logout" /> Sign out</button>
        </div>
      )}
    </div>
  );
}
