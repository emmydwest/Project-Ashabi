import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let client: SupabaseClient | undefined;

export function createClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (!client) {
    client = createBrowserClient(config.url, config.key);
  }
  return client;
}
