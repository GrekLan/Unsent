import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Handles email confirmation links from Supabase.
 * Verifies the OTP token and redirects to /login with a friendly message
 * instead of showing raw Supabase JSON errors.
 *
 * Email template should link to:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/login";

  const redirectTo = request.nextUrl.clone();

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // ✅ Email confirmed — send to login with success message
      redirectTo.pathname = "/login";
      redirectTo.searchParams.set("confirmed", "true");
      // Clear query params we don't want to leak
      redirectTo.searchParams.delete("token_hash");
      redirectTo.searchParams.delete("type");
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }

    // Token expired or invalid
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "link_expired");
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    return NextResponse.redirect(redirectTo);
  }

  // Missing params – redirect to login with generic error
  redirectTo.pathname = next;
  redirectTo.searchParams.set("error", "invalid_link");
  return NextResponse.redirect(redirectTo);
}
