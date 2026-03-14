"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

interface UsageData {
  subscriptionTier: string;
  limit: number | null;
  used: number;
  unlimited: boolean;
}

export function UsageDisplay() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch("/api/usage");
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse mb-8">
        <div className="h-4 bg-antiquewhite/10 rounded w-3/4 mb-3"></div>
        <div className="h-2 bg-antiquewhite/10 rounded-full w-full"></div>
      </Card>
    );
  }

  if (!usage) return null;

  const percentUsed = usage.limit ? Math.min(100, (usage.used / usage.limit) * 100) : 0;
  const isNearLimit = usage.limit ? percentUsed >= 80 : false;
  const isAtLimit = usage.limit ? usage.used >= usage.limit : false;

  return (
    <Card className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            usage.unlimited
              ? "bg-paleviolet/15"
              : isAtLimit
              ? "bg-red-500/15"
              : isNearLimit
              ? "bg-orange-500/15"
              : "bg-cappuccino/15"
          }`}>
            <Zap className={`w-4 h-4 ${
              usage.unlimited
                ? "text-paleviolet"
                : isAtLimit
                ? "text-red-400"
                : isNearLimit
                ? "text-orange-400"
                : "text-cappuccino-light"
            }`} />
          </div>
          <div>
            <p className="text-xs text-antiquewhite/50 uppercase tracking-wide">This month</p>
            {usage.unlimited ? (
              <p className="text-antiquewhite font-medium text-sm">Unlimited analyses</p>
            ) : isAtLimit ? (
              <p className="text-red-400 font-medium text-sm">
                You have surpassed your monthly credits.
              </p>
            ) : (
              <p className="text-antiquewhite font-medium text-sm">
                {usage.used}<span className="text-antiquewhite/40">/{usage.limit}</span> analyses
              </p>
            )}
          </div>
        </div>

        {!usage.unlimited && (
          <Link
            href="/upgrade"
            className="flex items-center gap-1 text-xs text-paleviolet/70 hover:text-paleviolet transition-colors group"
          >
            Upgrade
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {!usage.unlimited && usage.limit && (
        <div className="mt-3">
          <div className="h-1.5 bg-antiquewhite/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAtLimit
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : isNearLimit
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "bg-gradient-to-r from-cappuccino to-paleviolet/60"
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
