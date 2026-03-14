import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client with service role key.
 * Lazily initialized to avoid issues during build time.
 */
let adminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminInstance) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase admin credentials not configured");
    }
    adminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return adminInstance;
}
