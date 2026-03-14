"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glow";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-paleviolet/50 focus:ring-offset-2 focus:ring-offset-licorice disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] will-change-transform";

    const variants = {
      primary:
        "bg-gradient-to-r from-cappuccino to-cappuccino-light text-antiquewhite hover:shadow-glow-sm hover:brightness-110",
      secondary:
        "bg-antiquewhite/[0.02] border border-antiquewhite/10 text-antiquewhite/80 hover:bg-antiquewhite/[0.05] hover:border-antiquewhite/20 hover:text-antiquewhite",
      ghost:
        "bg-transparent text-antiquewhite/70 hover:bg-antiquewhite/[0.06] hover:text-antiquewhite",
      glow:
        "bg-gradient-to-r from-paleviolet to-paleviolet-light text-white hover:shadow-glow hover:brightness-110",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
