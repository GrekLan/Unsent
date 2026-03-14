"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

interface DatePrepResult {
  topics: string;
  energy: string;
  avoid: string;
  followUp: string;
}

export default function DatePrepPage() {
  const [knowAboutThem, setKnowAboutThem] = useState("");
  const [dateType, setDateType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DatePrepResult | null>(null);

  const handleSubmit = async () => {
    if (!knowAboutThem.trim()) {
      setError("Please tell us what you know about them");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/date-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knowAboutThem: knowAboutThem.trim(),
          dateType: dateType.trim() || "casual date",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError(data.error || "You've reached your monthly limit. Upgrade to continue.");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setResult(data.result);
    } catch {
      setError("Failed to generate date prep. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-10 sm:py-12">
      <PageHeader
        eyebrow="Date prep"
        title="Date Prep Mode"
        description="Get personalized conversation topics and advice for your date."
        className="mb-8"
      />

      <Card className="space-y-6 mb-8">
        <h2 className="text-lg font-semibold text-antiquewhite">Prepare for your date:</h2>

        <Textarea
          label="What do you know about them? (interests, job, vibe)"
          value={knowAboutThem}
          onChange={(e) => setKnowAboutThem(e.target.value)}
          placeholder="They work in marketing, love hiking and indie music, have a golden retriever named Max..."
          className="h-32"
        />

        <Input
          label="Type of date (coffee, drinks, dinner, walk)"
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
          placeholder="Coffee date at a cozy cafe"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={!knowAboutThem.trim() || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Generating..." : "Generate date prep"}
        </Button>
      </Card>

      {result && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-2">
              Conversation topics
            </h3>
            <p className="text-antiquewhite/80">{result.topics}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-2">
              Energy level
            </h3>
            <p className="text-antiquewhite/80">{result.energy}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-2">
              Topics to avoid
            </h3>
            <p className="text-antiquewhite/80">{result.avoid}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-2">
              Follow-up text suggestion
            </h3>
            <p className="text-antiquewhite/80 italic">&ldquo;{result.followUp}&rdquo;</p>
          </div>
        </Card>
      )}
    </Container>
  );
}
