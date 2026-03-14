"use client";

import { Check, Heart, Zap, Sparkles, Crown, Star, IndianRupee, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CheckoutButton } from "@/components/dashboard/CheckoutButton";
import { PricingSwitch } from "@/components/ui/PricingSwitch";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Special Sale - ends March 14, 2026
const SALE_END_DATE = new Date("2026-03-14T23:59:59");
const IS_SALE_ACTIVE = new Date() < SALE_END_DATE;

type Currency = "INR" | "USD";
type BillingPeriod = "monthly" | "yearly";

interface PlanPricing {
  INR: { monthly: number; yearly: number };
  USD: { monthly: number; yearly: number };
}

interface PlanSalePricing {
  INR: { monthly: number; yearly: number };
  USD: { monthly: number; yearly: number };
}

interface Plan {
  name: string;
  tier: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  planIdBase?: string;
  icon: typeof Zap;
  badge?: string;
  pricing?: PlanPricing;
  salePricing?: PlanSalePricing;
}

// ─── Pricing Data ───────────────────────────────────────────────
const PLANS: Plan[] = [
  {
    name: "Free",
    tier: "free",
    features: [
      "3 chat analyses / month",
      "Basic conversation coaching",
      "Community access",
    ],
    cta: "Current plan",
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Basic",
    tier: "basic",
    planIdBase: "basic",
    pricing: {
      INR: { monthly: 399, yearly: 3999 },
      USD: { monthly: 4.9, yearly: 49 },
    },
    salePricing: IS_SALE_ACTIVE
      ? {
          INR: { monthly: 299, yearly: 2999 },
          USD: { monthly: 3.9, yearly: 39 },
        }
      : undefined,
    features: [
      "15 chat analyses / month",
      "Conversation coaching",
      "Profile optimization tips",
      "Email support",
    ],
    cta: IS_SALE_ACTIVE ? "Get Launch Deal" : "Upgrade now",
    highlighted: false,
    icon: Star,
  },
  {
    name: "Pro",
    tier: "pro",
    planIdBase: "pro",
    pricing: {
      INR: { monthly: 999, yearly: 9999 },
      USD: { monthly: 11.9, yearly: 119 },
    },
    salePricing: IS_SALE_ACTIVE
      ? {
          INR: { monthly: 699, yearly: 6999 },
          USD: { monthly: 7.9, yearly: 79 },
        }
      : undefined,
    features: [
      "Unlimited chat analyses",
      "Dating profile optimization",
      "Weekly suggestion coaching",
      "Priority response time",
    ],
    cta: IS_SALE_ACTIVE ? "Get Launch Deal" : "Upgrade now",
    highlighted: true,
    icon: Sparkles,
    badge: "Most Popular",
  },
  {
    name: "Pro Plus",
    tier: "pro_plus",
    planIdBase: "pro_plus",
    pricing: {
      INR: { monthly: 1299, yearly: 12999 },
      USD: { monthly: 14.9, yearly: 149 },
    },
    salePricing: IS_SALE_ACTIVE
      ? {
          INR: { monthly: 999, yearly: 9999 },
          USD: { monthly: 9.9, yearly: 99 },
        }
      : undefined,
    features: [
      "Everything in Pro",
      "Priority support",
      "Same day date prep",
      "Dedicated coaching",
    ],
    cta: IS_SALE_ACTIVE ? "Get Launch Deal" : "Upgrade now",
    highlighted: false,
    icon: Crown,
  },
];

// ─── Helpers ────────────────────────────────────────────────────
function formatPrice(amount: number, currency: Currency) {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  // USD – show clean decimals
  return `$${amount % 1 === 0 ? amount : amount.toFixed(1)}`;
}

function getPlanId(planIdBase: string, period: BillingPeriod, currency: Currency) {
  return `${planIdBase}_${period}_${currency.toLowerCase()}`;
}

// ─── Component ──────────────────────────────────────────────────
export default function UpgradePage() {
  const [timeLeft, setTimeLeft] = useState("");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  useEffect(() => {
    if (!IS_SALE_ACTIVE) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = SALE_END_DATE.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("Sale Ended!");
        window.location.reload();
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-paleviolet/10 to-transparent pointer-events-none" />

      {/* Sale Banner */}
      {IS_SALE_ACTIVE && (
        <div className="relative mb-10 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-paleviolet/20 via-pink-500/15 to-paleviolet/20" />
          <div className="absolute inset-0 noise-bg" />
          <div className="relative z-10 text-center py-5 px-6">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
              <span className="text-lg font-bold text-antiquewhite">
                Special Launch Sale!
              </span>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
            </div>
            <p className="text-antiquewhite/60 text-sm">
              Up to <span className="font-bold text-pink-300">30% OFF</span> •
              Ends in{" "}
              <span className="font-mono text-antiquewhite/80">{timeLeft}</span>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <p className="text-xs uppercase tracking-widest text-paleviolet/70 mb-3">
          Pricing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-antiquewhite mb-2">
          Upgrade your dating game
        </h1>
        <p className="text-antiquewhite/40 text-sm max-w-md mx-auto">
          Choose the plan that fits your needs. Cancel anytime.
        </p>
      </div>

      {/* ─── Toggles ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10 relative z-10">
        {/* Currency toggle */}
        <div className="flex items-center gap-1 bg-licorice-light/60 border border-antiquewhite/[0.08] rounded-xl p-1">
          <button
            onClick={() => setCurrency("INR")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              currency === "INR"
                ? "bg-paleviolet/15 text-paleviolet shadow-sm"
                : "text-antiquewhite/40 hover:text-antiquewhite/60"
            )}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            INR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              currency === "USD"
                ? "bg-paleviolet/15 text-paleviolet shadow-sm"
                : "text-antiquewhite/40 hover:text-antiquewhite/60"
            )}
          >
            <DollarSign className="w-3.5 h-3.5" />
            USD
          </button>
        </div>

        {/* Billing period – sliding toggle switch */}
        <PricingSwitch
          isYearly={billingPeriod === "yearly"}
          onToggle={(yearly) => setBillingPeriod(yearly ? "yearly" : "monthly")}
        />
      </div>

      {/* ─── Plan Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {PLANS.map((plan) => {
          const Icon = plan.icon;

          // Compute displayed price
          const hasPricing = !!plan.pricing;
          const regularPrice = plan.pricing?.[currency]?.[billingPeriod];
          const salePrice = plan.salePricing?.[currency]?.[billingPeriod];
          const isSale = IS_SALE_ACTIVE && !!salePrice;
          const displayPrice = isSale ? salePrice : regularPrice;

          const periodLabel = billingPeriod === "monthly" ? "/mo" : "/yr";
          const planId = plan.planIdBase
            ? getPlanId(plan.planIdBase, billingPeriod, currency)
            : undefined;

          return (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col relative overflow-hidden transition-transform duration-300",
                plan.highlighted &&
                  "border-paleviolet/30 shadow-glow-sm lg:scale-[1.03]",
                isSale && !plan.highlighted && "border-pink-500/20"
              )}
            >
              {/* Badges – top-right corner stack */}
              <div className="absolute top-0 right-0 flex flex-col items-end">
                {plan.badge && (
                  <div className="bg-gradient-to-r from-paleviolet to-paleviolet-light text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-bl-xl">
                    {plan.badge}
                  </div>
                )}
                {isSale && !plan.badge && (
                  <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-bl-xl">
                    Sale
                  </div>
                )}
                {/* 20% OFF badge – shown on paid cards when yearly */}
                {hasPricing && billingPeriod === "yearly" && (
                  <div className="mt-0.5 mr-1.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full animate-scale-in">
                    20% OFF
                  </div>
                )}
              </div>

              <div className="flex-grow">
                {/* Icon + Name */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      plan.highlighted
                        ? "bg-paleviolet/15"
                        : "bg-antiquewhite/[0.06]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        plan.highlighted
                          ? "text-paleviolet"
                          : "text-antiquewhite/50"
                      )}
                    />
                  </div>
                  <h2 className="text-lg font-bold text-antiquewhite">
                    {plan.name}
                  </h2>
                </div>

                {/* Pricing */}
                <div className="mb-6 min-h-[3.5rem] flex flex-col justify-center">
                  {hasPricing ? (
                    <>
                      {isSale && regularPrice !== undefined && (
                        <span className="text-sm text-antiquewhite/30 line-through mb-0.5">
                          {formatPrice(regularPrice, currency)}
                          {periodLabel}
                        </span>
                      )}
                      <div>
                        <span
                          className={cn(
                            "text-3xl font-bold",
                            isSale ? "text-pink-300" : "text-antiquewhite"
                          )}
                        >
                          {displayPrice !== undefined
                            ? formatPrice(displayPrice, currency)
                            : "—"}
                        </span>
                        <span className="text-antiquewhite/40 text-sm ml-1">
                          {periodLabel}
                        </span>
                      </div>
                      {billingPeriod === "yearly" && regularPrice !== undefined && (
                        <p className="text-[11px] text-antiquewhite/30 mt-1">
                          {formatPrice(
                            Math.round(((isSale && salePrice ? salePrice : regularPrice) / 12) * 10) / 10,
                            currency
                          )}
                          /mo billed yearly
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-antiquewhite">
                      {currency === "INR" ? "₹0" : "$0"}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-paleviolet/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-paleviolet" />
                      </div>
                      <span className="text-sm text-antiquewhite/60">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              {planId ? (
                <CheckoutButton
                  priceId={planId}
                  highlighted={plan.highlighted || isSale}
                  disabled={false}
                  useShiny={plan.highlighted}
                >
                  {plan.cta}
                </CheckoutButton>
              ) : (
                <div className="px-5 py-3 rounded-xl bg-antiquewhite/[0.04] text-center text-sm text-antiquewhite/30 font-medium">
                  {plan.cta}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
