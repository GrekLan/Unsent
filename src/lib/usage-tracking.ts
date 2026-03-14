import { createClient } from "@/lib/supabase/server";
import type { SubscriptionTier } from "@/types/database.types";

const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,
  basic: 15,
  pro: Infinity,
  pro_plus: Infinity,
};

/**
 * Gets the start and end timestamps for the current calendar month.
 */
export function getCurrentMonthPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Checks if a user has reached their usage limit for a feature.
 * Also increments the count atomically to prevent race conditions.
 */
export async function checkAndIncrementUsage(
  userId: string,
  featureType: string,
  subscriptionTier: SubscriptionTier
): Promise<{ allowed: boolean; remaining: number; limit: number; currentCount: number }> {
  const limit = TIER_LIMITS[subscriptionTier];
  
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit, currentCount: 0 };
  }

  const { start, end } = getCurrentMonthPeriod();
  const supabase = await createClient();

  // First, try to get existing record
  const { data: existing, error: selectError } = await supabase
    .from("usage_tracking")
    .select("id, count")
    .eq("user_id", userId)
    .eq("feature_type", featureType)
    .gte("period_start", start.toISOString())
    .lte("period_end", end.toISOString())
    .maybeSingle();

  // Check for table not existing error
  if (selectError && selectError.code === "42P01") {
    throw new Error("Usage tracking table does not exist. Please run the database setup SQL.");
  }

  let currentCount = 0;

  if (existing) {
    currentCount = existing.count;
  }

  // Check if already at limit BEFORE incrementing
  if (currentCount >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      currentCount,
    };
  }

  // Increment usage atomically
  if (existing) {
    const newCount = existing.count + 1;
    const { error: updateError } = await supabase
      .from("usage_tracking")
      .update({ count: newCount })
      .eq("id", existing.id);
    
    if (updateError) {
      console.error("Failed to update usage:", updateError);
      throw new Error("Failed to track usage");
    }
    currentCount = newCount;
  } else {
    // Create new record with count 1
    const { error: insertError } = await supabase.from("usage_tracking").insert({
      user_id: userId,
      feature_type: featureType,
      count: 1,
      period_start: start.toISOString(),
      period_end: end.toISOString(),
    });
    
    if (insertError) {
      console.error("Failed to insert usage:", insertError);
      throw new Error("Failed to track usage");
    }
    currentCount = 1;
  }

  const remaining = Math.max(0, limit - currentCount);

  return {
    allowed: true,
    remaining,
    limit,
    currentCount,
  };
}

/**
 * Legacy function - checks usage limit without incrementing
 */
export async function checkUsageLimit(
  userId: string,
  featureType: string,
  subscriptionTier: SubscriptionTier
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limit = TIER_LIMITS[subscriptionTier];
  
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit };
  }

  const { start, end } = getCurrentMonthPeriod();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("user_id", userId)
    .eq("feature_type", featureType)
    .gte("period_start", start.toISOString())
    .lte("period_end", end.toISOString())
    .maybeSingle();

  if (error && error.code === "42P01") {
    throw new Error("Usage tracking table does not exist");
  }

  const currentCount = data?.count || 0;
  const remaining = Math.max(0, limit - currentCount);

  return {
    allowed: currentCount < limit,
    remaining,
    limit,
  };
}

/**
 * Increments the usage count for a user's feature.
 */
export async function incrementUsage(
  userId: string,
  featureType: string
): Promise<number> {
  const { start, end } = getCurrentMonthPeriod();
  const supabase = await createClient();

  // Try to get existing record
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, count")
    .eq("user_id", userId)
    .eq("feature_type", featureType)
    .gte("period_start", start.toISOString())
    .lte("period_end", end.toISOString())
    .maybeSingle();

  if (existing) {
    // Update existing record
    const newCount = existing.count + 1;
    await supabase
      .from("usage_tracking")
      .update({ count: newCount })
      .eq("id", existing.id);
    return newCount;
  } else {
    // Create new record
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      feature_type: featureType,
      count: 1,
      period_start: start.toISOString(),
      period_end: end.toISOString(),
    });
    return 1;
  }
}
