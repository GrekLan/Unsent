"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ReplyCard } from "@/components/analyze/ReplyCard";
import {
  Upload,
  X,
  Image as ImageIcon,
  LogIn,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

type Goal = "get_date" | "keep_interest" | "fix_awkward";

const goals: { value: Goal; label: string; emoji: string }[] = [
  { value: "get_date", label: "Get a date", emoji: "💘" },
  { value: "keep_interest", label: "Keep interest", emoji: "🔥" },
  { value: "fix_awkward", label: "Fix awkward moment", emoji: "😅" },
];

const GUEST_LIMIT = 3;
const STORAGE_KEY = "dc_guest_uses";

interface AnalysisResult {
  signals: string;
  avoid: string[];
  replies: {
    calm: string;
    confident: string;
    playful: string;
  };
}

/* ─── Monthly usage tracking ─── */
interface GuestUsageData {
  count: number;
  month: string; // "YYYY-MM"
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getGuestUsage(): GuestUsageData {
  if (typeof window === "undefined") return { count: 0, month: getCurrentMonth() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: getCurrentMonth() };

    const data = JSON.parse(raw);

    // Migrate old format (plain number) to new monthly format
    if (typeof data === "number") {
      const usage: GuestUsageData = { count: data, month: getCurrentMonth() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
      return usage;
    }

    // Reset if different month
    if (data.month !== getCurrentMonth()) {
      const reset: GuestUsageData = { count: 0, month: getCurrentMonth() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      return reset;
    }

    return data as GuestUsageData;
  } catch {
    return { count: 0, month: getCurrentMonth() };
  }
}

function incrementGuestUsage(): GuestUsageData {
  const current = getGuestUsage();
  const updated: GuestUsageData = {
    count: current.count + 1,
    month: getCurrentMonth(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
  return updated;
}

/* ─── Image compression ─── */
function compressImage(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/* ─── Component ─── */
export function GuestAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [conversationText, setConversationText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal>("keep_interest");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [guestUses, setGuestUses] = useState(0);
  const [showLoginWall, setShowLoginWall] = useState(false);

  useEffect(() => {
    const usage = getGuestUsage();
    setGuestUses(usage.count);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (guestUses >= GUEST_LIMIT) {
      setShowLoginWall(true);
      return;
    }

    if (!conversationText.trim() && !selectedFile) {
      setError("Please paste a conversation or upload a screenshot");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let imageBase64: string | null = null;
      if (selectedFile) {
        try {
          imageBase64 = await compressImage(selectedFile, 1024, 1024);
        } catch {
          setError("Failed to process image. Please try a different image.");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/analyze-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationText: conversationText.trim(),
          imageBase64,
          goal,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError(
          `Server error (${response.status}): Failed to parse response`
        );
        return;
      }

      if (!response.ok) {
        setError(
          data.error || `Request failed with status ${response.status}`
        );
        return;
      }

      const updated = incrementGuestUsage();
      setGuestUses(updated.count);
      setResult(data.result);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const hasInput = conversationText.trim().length > 0 || selectedFile !== null;
  const remainingTries = Math.max(0, GUEST_LIMIT - guestUses);

  // ─── Login Wall ───
  if (showLoginWall) {
    return (
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-b from-paleviolet/5 to-transparent rounded-3xl pointer-events-none blur-xl" />
        <Card className="text-center py-14 px-8 border-paleviolet/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-card-glow pointer-events-none" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-paleviolet/10 border border-paleviolet/20 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-7 h-7 text-paleviolet" />
            </div>
            <h2 className="text-2xl font-bold text-antiquewhite mb-3">
              Login to continue
            </h2>
            <p className="text-antiquewhite/45 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              You&apos;ve used your {GUEST_LIMIT} free monthly analyses. Log in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button variant="glow" size="lg" className="w-full sm:w-auto">
                  Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Input Form ─── */}
      <Card className="space-y-5 border-antiquewhite/[0.08] hover:border-antiquewhite/[0.12] transition-colors duration-500 relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-paleviolet/30 to-transparent" />

        {/* Textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-antiquewhite/50 mb-3">
            Paste chat or upload screenshot
          </label>
          <Textarea
            value={conversationText}
            onChange={(e) => setConversationText(e.target.value)}
            placeholder="Paste your conversation here..."
            className="h-36 sm:h-44"
          />
        </div>

        {/* Screenshot upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative inline-block">
              <div className="relative rounded-xl overflow-hidden border border-antiquewhite/10">
                <img
                  src={imagePreview}
                  alt="Screenshot preview"
                  className="max-h-40 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-licorice/80 hover:bg-red-600 rounded-lg transition-colors duration-200"
                >
                  <X className="w-3.5 h-3.5 text-antiquewhite" />
                </button>
              </div>
              <p className="text-xs text-antiquewhite/30 mt-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                {selectedFile?.name}
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-antiquewhite/[0.08] text-sm text-antiquewhite/35 hover:border-paleviolet/20 hover:text-antiquewhite/60 hover:bg-paleviolet/[0.03] transition-all duration-300"
            >
              <Upload className="w-4 h-4 group-hover:text-paleviolet transition-colors" />
              Upload screenshot
            </button>
          )}
        </div>

        {/* Goal selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-antiquewhite/50 mb-3">
            What&apos;s your goal?
          </label>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  goal === g.value
                    ? "bg-paleviolet/15 border border-paleviolet/30 text-paleviolet shadow-glow-sm"
                    : "bg-antiquewhite/[0.03] border border-antiquewhite/[0.06] text-antiquewhite/40 hover:bg-antiquewhite/[0.06] hover:text-antiquewhite/60 hover:border-antiquewhite/[0.12]"
                }`}
              >
                <span className="mr-1.5">{g.emoji}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleSubmit}
            disabled={!hasInput || isLoading}
            className={`w-full relative group px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 overflow-hidden ${
              !hasInput || isLoading
                ? "bg-antiquewhite/[0.04] text-antiquewhite/25 cursor-not-allowed border border-antiquewhite/[0.04]"
                : "bg-gradient-to-r from-paleviolet to-paleviolet-light text-white hover:shadow-glow-lg hover:brightness-110 active:scale-[0.98] border border-paleviolet/30"
            }`}
          >
            {/* Shimmer effect on hover */}
            {hasInput && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing your conversation…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Conversation
                </>
              )}
            </span>
          </button>

          {remainingTries > 0 && remainingTries < GUEST_LIMIT && (
            <p className="text-xs text-antiquewhite/25 text-center">
              {remainingTries} free{" "}
              {remainingTries === 1 ? "try" : "tries"} remaining this month •{" "}
              <Link
                href="/login"
                className="text-paleviolet/50 hover:text-paleviolet transition-colors"
              >
                Login for more
              </Link>
            </p>
          )}
        </div>
      </Card>

      {/* ─── Results ─── */}
      {result && (
        <div ref={resultsRef} className="space-y-6 animate-fade-up">
          {/* Section title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-paleviolet/10 border border-paleviolet/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-paleviolet" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-antiquewhite">
                Your Analysis
              </h2>
              <p className="text-xs text-antiquewhite/30">AI-powered coaching</p>
            </div>
          </div>

          {/* Signals */}
          <Card className="border-paleviolet/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-paleviolet/30 to-transparent" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-paleviolet/60 mb-3">
              What this message signals
            </h3>
            <p className="text-antiquewhite/75 text-sm leading-relaxed">
              {result.signals}
            </p>
          </Card>

          {/* Avoid */}
          <Card>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-red-400/60 mb-3">
              What to avoid
            </h3>
            <ul className="space-y-2.5">
              {result.avoid.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-antiquewhite/60"
                >
                  <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center text-[10px] text-red-400 shrink-0 mt-0.5">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Replies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-antiquewhite/40 mb-4">
              Suggested replies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReplyCard title="Calm" content={result.replies.calm} />
              <ReplyCard title="Confident" content={result.replies.confident} />
              <ReplyCard title="Playful" content={result.replies.playful} />
            </div>
          </div>

          {/* CTA nudge */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cappuccino/20 via-paleviolet/15 to-cappuccino/20" />
            <div className="absolute inset-0 noise-bg" />
            <div className="relative z-10 text-center py-8 px-6">
              <p className="text-antiquewhite font-medium mb-1.5 text-sm">
                ✨ Want unlimited analyses, profile reviews & date prep?
              </p>
              <p className="text-xs text-antiquewhite/35 mb-5">
                Create a free account to save your history and unlock more
                features.
              </p>
              <Link href="/signup">
                <Button variant="glow" size="md">
                  Sign Up Free
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
