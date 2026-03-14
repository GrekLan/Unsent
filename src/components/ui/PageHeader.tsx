"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-paleviolet/70 font-semibold mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-antiquewhite">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-antiquewhite/45 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

