"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", heart: 8, text: "text-base" },
    md: { icon: "w-8 h-8", heart: 9, text: "text-lg" },
    lg: { icon: "w-10 h-10", heart: 11, text: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Chat bubble + heart icon */}
      <div className={cn("relative shrink-0", s.icon)}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Chat bubble */}
          <path
            d="M4 8C4 5.79 5.79 4 8 4H26C28.21 4 30 5.79 30 8V22C30 24.21 28.21 26 26 26H14L8 32V26H8C5.79 26 4 24.21 4 22V8Z"
            fill="#2a1e26"
            stroke="rgba(254,237,219,0.15)"
            strokeWidth="0.5"
          />
          {/* Three dots */}
          <circle cx="11" cy="15" r="2" fill="#FEEDDB" opacity="0.8" />
          <circle cx="17" cy="15" r="2" fill="#FEEDDB" opacity="0.8" />
          <circle cx="23" cy="15" r="2" fill="#FEEDDB" opacity="0.8" />
          {/* Heart */}
          <path
            d={`M28 ${s.heart}C28 ${s.heart - 3} 32 ${s.heart - 5} 34 ${s.heart}C36 ${s.heart - 5} 40 ${s.heart - 3} 40 ${s.heart}C40 ${s.heart + 4} 34 ${s.heart + 8} 34 ${s.heart + 10}C34 ${s.heart + 8} 28 ${s.heart + 4} 28 ${s.heart}Z`}
            fill="#C56F8C"
          />
        </svg>
      </div>

      {/* "unSent" text */}
      {showText && (
        <span className={cn("font-bold tracking-tight select-none", s.text)}>
          <span className="text-antiquewhite/70 italic relative">
            un
            {/* Strikethrough line */}
            <span
              className="absolute left-0 right-0 top-1/2 h-[1.5px] -rotate-6"
              style={{
                background: "linear-gradient(90deg, #C56F8C, rgba(197,111,140,0.4))",
              }}
            />
          </span>
          <span className="text-antiquewhite italic">Sent</span>
        </span>
      )}
    </div>
  );
}
