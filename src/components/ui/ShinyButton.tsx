"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "md" | "lg";
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  disabled = false,
  size = "lg",
}: ShinyButtonProps) {
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        "shiny-cta",
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
}
