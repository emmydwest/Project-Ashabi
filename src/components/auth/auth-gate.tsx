"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/signin");
      else setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/signin");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (!ready) {
    return <main className="route-loading"><p>Opening your Ashabi account…</p></main>;
  }
  return <>{children}</>;
}
