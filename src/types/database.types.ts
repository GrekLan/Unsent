/**
 * Subscription tier options for users.
 */
export type SubscriptionTier = "free" | "basic" | "pro" | "pro_plus";

/**
 * Types of analyses that can be performed.
 */
export type AnalysisType = "conversation" | "profile" | "date_prep";

/**
 * User profile stored in the database.
 */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  razorpay_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Analysis record stored in the database.
 */
export interface Analysis {
  id: string;
  user_id: string;
  type: AnalysisType;
  input_data: Record<string, unknown>;
  goal: string | null;
  result_data: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Usage tracking record for rate limiting.
 */
export interface UsageTracking {
  id: string;
  user_id: string;
  feature_type: string;
  count: number;
  period_start: string;
  period_end: string;
}
