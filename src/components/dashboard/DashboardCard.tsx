"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function DashboardCard({ title, description, href, icon: Icon }: DashboardCardProps) {
  return (
    <Link href={href} className="group">
      <Card
        className={cn(
          "h-full min-h-[160px] flex flex-col relative overflow-hidden",
          "hover:border-paleviolet/20 hover:bg-antiquewhite/[0.06] cursor-pointer",
          "hover-lift"
        )}
      >
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-paleviolet/10 flex items-center justify-center mb-4 group-hover:bg-paleviolet/15 transition-colors duration-300">
            <Icon className="w-5 h-5 text-paleviolet" />
          </div>
          <h3 className="text-lg font-semibold text-antiquewhite mb-1.5 group-hover:text-gradient-warm transition-colors duration-300">
            {title}
          </h3>
          <p className="text-antiquewhite/50 text-sm flex-grow">{description}</p>
        </div>

        <div className="mt-4 flex items-center text-xs text-paleviolet/60 group-hover:text-paleviolet transition-colors duration-300">
          <span className="mr-1">Open</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </Card>
    </Link>
  );
}
