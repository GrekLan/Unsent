/**
 * Result from conversation analysis.
 */
export interface ConversationAnalysisResult {
  signals: string;
  avoid: string[];
  replies: {
    calm: string;
    confident: string;
    playful: string;
  };
}

/**
 * Result from date preparation analysis.
 */
export interface DatePrepResult {
  topics: string;
  energy: string;
  avoid: string;
  followUp: string;
}

/**
 * Result from profile analysis.
 */
export interface ProfileAnalysisResult {
  strengths: string;
  improvements: string;
  rewriteSuggestions: string;
}

/**
 * Goal options for conversation analysis.
 */
export type ConversationGoal = "get_date" | "keep_interest" | "fix_awkward";

/**
 * Request body for conversation analysis.
 */
export interface ConversationAnalysisRequest {
  conversationText: string;
  goal: ConversationGoal;
}

/**
 * Request body for date prep.
 */
export interface DatePrepRequest {
  knowAboutThem: string;
  dateType: string;
}

/**
 * Request body for profile analysis.
 */
export interface ProfileAnalysisRequest {
  profileText: string;
}
