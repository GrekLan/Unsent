"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Apple-ish surface: subtle glass, fine border, top highlight, soft shadow
          "relative rounded-2xl p-6",
          "bg-antiquewhite/[0.03] backdrop-blur-xl",
          "border border-antiquewhite/[0.07]",
          "shadow-inner-glow",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          className
        )}
        {...props}
      >
        {/* Top highlight edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-antiquewhite/20 to-transparent" />
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
