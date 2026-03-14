"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Upload, X, Image as ImageIcon, Zap } from "lucide-react";

type Goal = "get_date" | "keep_interest" | "fix_awkward";

const goals: { value: Goal; label: string; emoji: string }[] = [
  { value: "get_date", label: "Get a date", emoji: "💘" },
  { value: "keep_interest", label: "Keep interest", emoji: "🔥" },
  { value: "fix_awkward", label: "Fix awkward moment", emoji: "😅" },
];

/**
 * Compresses an image file to fit within maxWidth/maxHeight
 * and returns a base64 data URL (JPEG, quality 0.7).
 */
function compressImage(file: File, maxWidth = 1024, maxHeight = 1024): Promise<string> {
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
          reject(new Error("Canvas context not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ConversationInput() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [conversationText, setConversationText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal>("keep_interest");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!conversationText.trim() && !selectedFile) {
      setError("Please paste a conversation or upload a screenshot");
      return;
    }

    setIsLoading(true);
    setError(null);

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

      const response = await fetch("/api/analyze", {
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
        setError(`Server error (${response.status}): Failed to parse response`);
        return;
      }

      if (!response.ok) {
        setError(data.error || `Request failed with status ${response.status}`);
        return;
      }

      router.push(`/analyze/results?id=${data.analysisId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const hasInput = conversationText.trim().length > 0 || selectedFile !== null;

  return (
    <Card className="space-y-5">
      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-antiquewhite/70 mb-2">
          Paste chat here or upload a screenshot
        </label>
        <Textarea
          value={conversationText}
          onChange={(e) => setConversationText(e.target.value)}
          placeholder="Paste your conversation here..."
          className="h-52"
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
                className="max-h-44 w-auto object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-licorice/80 hover:bg-red-600 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 text-antiquewhite" />
              </button>
            </div>
            <p className="text-xs text-antiquewhite/40 mt-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              {selectedFile?.name}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-antiquewhite/10 text-sm text-antiquewhite/40 hover:border-antiquewhite/20 hover:text-antiquewhite/60 hover:bg-antiquewhite/[0.02] transition-all duration-300"
          >
            <Upload className="w-4 h-4" />
            Upload screenshot
          </button>
        )}
      </div>

      {/* Goal selection */}
      <div>
        <label className="block text-sm font-medium text-antiquewhite/70 mb-3">
          What&apos;s your goal?
        </label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGoal(g.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                goal === g.value
                  ? "bg-paleviolet/15 border border-paleviolet/30 text-paleviolet"
                  : "bg-antiquewhite/[0.03] border border-antiquewhite/[0.08] text-antiquewhite/50 hover:bg-antiquewhite/[0.06] hover:text-antiquewhite/70"
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

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!hasInput || isLoading}
        className={`w-full relative group px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${
          !hasInput || isLoading
            ? "bg-antiquewhite/[0.06] text-antiquewhite/30 cursor-not-allowed"
            : "bg-gradient-to-r from-paleviolet to-paleviolet-light text-white hover:shadow-glow hover:brightness-110 active:scale-[0.98]"
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Analyze
            </>
          )}
        </span>
      </button>
    </Card>
  );
}
