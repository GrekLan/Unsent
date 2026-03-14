"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Check, Copy } from "lucide-react";

interface ReplyCardProps {
  title: string;
  content: string;
}

export function ReplyCard({ title, content }: ReplyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-[180px] hover:border-paleviolet/20 hover:shadow-glow-sm group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-paleviolet/70">
          {title}
        </p>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-antiquewhite/30 hover:text-antiquewhite hover:bg-antiquewhite/10 transition-all duration-200"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <p className="text-antiquewhite/80 text-sm leading-relaxed flex-grow">
        {content}
      </p>
      {copied && (
        <p className="text-xs text-green-400/80 mt-2 animate-fade-up">Copied!</p>
      )}
    </Card>
  );
}
