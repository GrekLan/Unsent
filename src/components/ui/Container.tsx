"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "md" | "lg";
};

const sizes = {
  md: "max-w-5xl",
  lg: "max-w-7xl",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full px-4 sm:px-6", sizes[size], className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

