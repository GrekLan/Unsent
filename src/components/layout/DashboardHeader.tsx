"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";
import { Logo } from "@/components/ui/Logo";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-antiquewhite/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="hover:opacity-80 transition-opacity"
        >
          <Logo size="md" />
        </Link>

        <UserMenu user={user} />
      </div>
      {/* subtle bottom highlight */}
      <div className="h-px bg-gradient-to-r from-transparent via-antiquewhite/[0.08] to-transparent" />
    </header>
  );
}
