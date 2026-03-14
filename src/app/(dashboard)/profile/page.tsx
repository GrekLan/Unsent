"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

interface ProfileResult {
  strengths: string;
  improvements: string;
  rewriteSuggestions: string;
}

export default function ProfilePage() {
  const [profileText, setProfileText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProfileResult | null>(null);

  const handleSubmit = async () => {
    if (!profileText.trim()) {
      setError("Please paste your profile content");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText: profileText.trim() }),
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
      setError("Failed to analyze profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-10 sm:py-12">
      <PageHeader
        eyebrow="Profile"
        title="Improve My Profile"
        description="Paste your dating profile bio, prompts, and other text to get feedback."
        className="mb-8"
      />

      <Card className="space-y-6 mb-8">
        <Textarea
          label="Your profile content"
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
          placeholder="Paste your bio, prompts, about me section, etc..."
          className="h-64"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={!profileText.trim() || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Analyzing..." : "Analyze Profile"}
        </Button>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-3">
              Strengths
            </h3>
            <p className="text-antiquewhite/80">{result.strengths}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-3">
              Areas for Improvement
            </h3>
            <p className="text-antiquewhite/80">{result.improvements}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-antiquewhite/90 mb-3">
              Suggested Rewrites
            </h3>
            <p className="text-antiquewhite/80 whitespace-pre-wrap">{result.rewriteSuggestions}</p>
          </Card>
        </div>
      )}
    </Container>
  );
}
