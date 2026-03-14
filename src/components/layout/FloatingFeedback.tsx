"use client";

import { useState, useEffect } from "react";
import { MessageSquareHeart, X } from "lucide-react";

const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfcZT0c0p-FBZtjBp-gfO554Q4bizN1cL45dOEaUwaV3eJp4g/viewform";

const STORAGE_KEY = "dc_guest_uses";
const DISMISSED_KEY = "dc_feedback_dismissed";
const MIN_ANALYSES = 2;

export function FloatingFeedback() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      if (dismissed === "true") return;

      // Check monthly guest uses
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      const count = typeof data === "number" ? data : data?.count ?? 0;

      if (count >= MIN_ANALYSES) {
        // Small delay so it doesn't flash immediately
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center animate-slide-in-left">
      {/* Tab button */}
      <div className="relative group">
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#2a1e26] border border-antiquewhite/10 border-l-0 rounded-r-xl px-4 py-3 text-sm font-medium text-antiquewhite/70 hover:text-antiquewhite hover:border-paleviolet/30 hover:bg-paleviolet/10 transition-all duration-300 shadow-lg shadow-black/20"
          style={{
            writingMode: "horizontal-tb",
          }}
        >
          <MessageSquareHeart className="w-4 h-4 text-paleviolet" />
          <span className="hidden sm:inline">Share feedback</span>
          <span className="sm:hidden">Feedback</span>
        </a>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-licorice border border-antiquewhite/15 flex items-center justify-center text-antiquewhite/40 hover:text-antiquewhite hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Dismiss feedback"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
