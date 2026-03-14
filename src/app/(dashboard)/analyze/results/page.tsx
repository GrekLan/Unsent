import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ReplyCard } from "@/components/analyze/ReplyCard";
import { getCurrentMonthPeriod } from "@/lib/usage-tracking";
import { MessageSquareHeart } from "lucide-react";

const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfcZT0c0p-FBZtjBp-gfO554Q4bizN1cL45dOEaUwaV3eJp4g/viewform";

export const metadata = {
  title: "Analysis Results - unSent",
  description: "Your conversation analysis results",
};

interface ResultsPageProps {
  searchParams: Promise<{ id?: string }>;
}

interface AnalysisResult {
  signals: string;
  avoid: string[];
  replies: {
    calm: string;
    confident: string;
    playful: string;
  };
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const analysisId = params.id;

  if (!analysisId) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: analysis } = await supabase
    .from("analyses")
    .select("result_data")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) {
    redirect("/dashboard");
  }

  // Check user's usage count to show feedback prompt after 2+ uses
  const { start, end } = getCurrentMonthPeriod();
  const { data: usageData } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("user_id", user.id)
    .eq("feature_type", "analyses")
    .gte("period_start", start.toISOString())
    .lte("period_end", end.toISOString())
    .maybeSingle();
  
  const usageCount = usageData?.count || 0;
  const showFeedbackPrompt = usageCount >= 2;

  const result = analysis.result_data as AnalysisResult;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-antiquewhite mb-8">Results</h1>
      
      <div className="space-y-8">
        {/* Signals Section */}
        <Card>
          <h2 className="text-lg font-semibold text-antiquewhite/90 mb-3">
            What this message likely signals
          </h2>
          <p className="text-antiquewhite/80">{result.signals}</p>
        </Card>

        {/* What to Avoid Section */}
        <Card>
          <h2 className="text-lg font-semibold text-antiquewhite/90 mb-3">
            What to avoid
          </h2>
          <ul className="space-y-2">
            {result.avoid.map((item, index) => (
              <li key={index} className="text-antiquewhite/80">
                • {item}
              </li>
            ))}
          </ul>
        </Card>

        {/* Suggested Replies Section */}
        <div>
          <h2 className="text-lg font-semibold text-antiquewhite/90 mb-4">
            Suggested replies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReplyCard title="Reply - Calm" content={result.replies.calm} />
            <ReplyCard title="Reply - Confident" content={result.replies.confident} />
            <ReplyCard title="Reply - Playful" content={result.replies.playful} />
          </div>
        </div>

        {/* Feedback Prompt - shows after 2+ analyses */}
        {showFeedbackPrompt && (
          <Card className="bg-gradient-to-r from-cappuccino/20 to-paleviolet/10 border-paleviolet/20">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex-shrink-0">
                <MessageSquareHeart className="w-8 h-8 text-paleviolet" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-antiquewhite">
                  Help us improve! 💜
                </h3>
                <p className="text-sm text-antiquewhite/70 mt-1">
                  You&apos;ve been using unSent - we&apos;d love your feedback (takes 1 min)
                </p>
              </div>
              <a
                href={FEEDBACK_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2 bg-paleviolet text-licorice font-medium rounded-lg hover:bg-paleviolet/90 transition-colors text-sm"
              >
                Give Feedback
              </a>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
