import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonthPeriod } from "@/lib/usage-tracking";
import type { SubscriptionTier } from "@/types/database.types";

export const dynamic = "force-dynamic";

const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  basic: 15,
  pro: Infinity,
  pro_plus: Infinity,
};

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const subscriptionTier = (profile?.subscription_tier || "free") as SubscriptionTier;
    const limit = TIER_LIMITS[subscriptionTier];

    // Get current month usage for shared "analyses" feature
    const { start, end } = getCurrentMonthPeriod();
    
    const { data: usageData } = await supabase
      .from("usage_tracking")
      .select("count")
      .eq("user_id", user.id)
      .eq("feature_type", "analyses")  // Shared limit across all features
      .gte("period_start", start.toISOString())
      .lte("period_end", end.toISOString())
      .maybeSingle();

    const totalUsage = usageData?.count || 0;

    return NextResponse.json({
      subscriptionTier,
      limit: limit === Infinity ? null : limit,
      used: totalUsage,
      unlimited: limit === Infinity,
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
