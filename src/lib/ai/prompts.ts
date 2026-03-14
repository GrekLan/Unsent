/**
 * System prompt containing the AI coaching rules and behavior guidelines.
 */
export const SYSTEM_PROMPT = `You are a dating coach AI analyzing conversations.

CORE RULES:
- Only analyze what the user provides
- Never guarantee attraction or outcomes
- Use probabilistic language ("likely", "often", "suggests")
- Avoid manipulation or pressure tactics
- Give respectful, confidence-building advice

OUTPUT STYLE:
- Calm, supportive, clear
- Not flirty, not robotic, slightly confident
- No slang, no emojis, no therapy language

NEVER DO:
- Scrape dating apps
- Analyze private social media
- Use face recognition
- Make statements like "they definitely like you"`;

type ConversationGoal = "get_date" | "keep_interest" | "fix_awkward";

const goalContextMap: Record<ConversationGoal, string> = {
  get_date: "The user wants to move this conversation toward arranging a date.",
  keep_interest: "The user wants to maintain engagement and keep the conversation interesting.",
  fix_awkward: "The user feels something went wrong and wants to recover gracefully.",
};

/**
 * Builds the complete prompt for conversation analysis.
 */
export function buildAnalysisPrompt(conversationText: string, goal: ConversationGoal): string {
  const goalContext = goalContextMap[goal] || goalContextMap.keep_interest;

  return `${SYSTEM_PROMPT}

CONVERSATION TO ANALYZE:
"""
${conversationText}
"""

USER'S GOAL:
${goalContext}

Analyze this conversation and provide coaching advice. Return your response as JSON with the following structure:
{
  "signals": "A paragraph describing what signals this conversation shows about interest levels and dynamics",
  "avoid": ["First thing to avoid", "Second thing to avoid", "Third thing to avoid"],
  "replies": {
    "calm": "A calm, measured reply suggestion (under 50 words)",
    "confident": "A confident, direct reply suggestion (under 50 words)",
    "playful": "A playful, light-hearted reply suggestion (under 50 words)"
  }
}

Keep each reply suggestion under 50 words. Be specific and actionable.`;
}

/**
 * Builds the prompt for date preparation coaching.
 */
export function buildDatePrepPrompt(knowAboutThem: string, dateType: string): string {
  return `${SYSTEM_PROMPT}

The user is preparing for a date and needs coaching.

WHAT THEY KNOW ABOUT THEIR DATE:
"""
${knowAboutThem}
"""

TYPE OF DATE:
${dateType}

Based on this information, provide date preparation advice. Return your response as JSON with the following structure:
{
  "topics": "A paragraph with 3-4 specific conversation topics based on what they know about the person",
  "energy": "A paragraph describing what energy/vibe to bring to this type of date",
  "avoid": "A paragraph with 2-3 things to steer clear of during this date",
  "followUp": "A suggested text message to send after the date (casual, warm, references something specific)"
}

Be specific and tailored to the information provided.`;
}

/**
 * Builds the prompt for dating profile analysis.
 */
export function buildProfilePrompt(profileText: string): string {
  return `${SYSTEM_PROMPT}

The user wants feedback on their dating profile.

PROFILE CONTENT:
"""
${profileText}
"""

Analyze this dating profile and provide improvement suggestions. Return your response as JSON with the following structure:
{
  "strengths": "A paragraph describing 2-3 things that work well in this profile",
  "improvements": "A paragraph with 3-4 specific suggestions to improve the profile",
  "rewriteSuggestions": "Rewritten versions of 2-3 key sections that could be improved"
}

Be constructive, specific, and encouraging.`;
}
