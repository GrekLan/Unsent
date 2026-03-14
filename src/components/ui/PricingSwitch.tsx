"use client";

import { cn } from "@/lib/utils";

interface PricingSwitchProps {
  isYearly: boolean;
  onToggle: (value: boolean) => void;
}

export function PricingSwitch({ isYearly, onToggle }: PricingSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Monthly label */}
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          !isYearly ? "text-antiquewhite" : "text-antiquewhite/40"
        )}
      >
        Monthly
      </span>

      {/* Toggle track */}
      <button
        role="switch"
        aria-checked={isYearly}
        onClick={() => onToggle(!isYearly)}
        className={cn(
          "relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paleviolet/50 focus-visible:ring-offset-2 focus-visible:ring-offset-licorice",
          isYearly
            ? "border-paleviolet/40 bg-paleviolet/20"
            : "border-antiquewhite/10 bg-antiquewhite/[0.06]"
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full shadow-md transition-all duration-300",
            isYearly
              ? "translate-x-[26px] bg-paleviolet"
              : "translate-x-[3px] bg-antiquewhite/60"
          )}
        />
      </button>

      {/* Yearly label + badge */}
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            isYearly ? "text-antiquewhite" : "text-antiquewhite/40"
          )}
        >
          Yearly
        </span>

        {/* 20% OFF badge – always rendered, animated in/out */}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-300",
            isYearly
              ? "scale-100 opacity-100 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "scale-75 opacity-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          )}
        >
          20% OFF
        </span>
      </span>
    </div>
  );
}
