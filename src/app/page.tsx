"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { GuestAnalyzer } from "@/components/analyze/GuestAnalyzer";
import { FloatingFeedback } from "@/components/layout/FloatingFeedback";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { TypeWriter } from "@/components/landing/TypeWriter";
import {
  Sparkles,
  MessageSquare,
  User,
  Calendar,
  ArrowRight,
  Check,
  ChevronDown,
  Zap,
  Shield,
  Clock,
  Heart,
  Eye,
  Send,
} from "lucide-react";

/* ─── DATA ─── */
const heroWords = [
  "nail the first message",
  "keep them interested",
  "get a date tonight",
  "read between the lines",
  "recover from the awkward",
];

const stats = [
  { value: "10k+", label: "Conversations analyzed", icon: MessageSquare },
  { value: "95%", label: "User satisfaction", icon: Heart },
  { value: "<3s", label: "Response time", icon: Zap },
  { value: "24/7", label: "Always available", icon: Clock },
];

const steps = [
  {
    num: "01",
    title: "Paste or upload",
    desc: "Drop in your chat screenshot or paste the conversation text. We support all messaging platforms.",
    icon: Send,
  },
  {
    num: "02",
    title: "AI analyzes",
    desc: "Our AI reads between the lines — detecting tone, interest signals, and hidden intentions in seconds.",
    icon: Eye,
  },
  {
    num: "03",
    title: "Get your move",
    desc: "Receive multiple reply options in different tones — calm, confident, or playful. Pick your style.",
    icon: Sparkles,
  },
];

const features = [
  {
    icon: MessageSquare,
    title: "Chat Analysis",
    desc: "AI-powered coaching on what to say next, with multiple tone options tailored to your style.",
    gradient: "from-paleviolet/20 to-transparent",
  },
  {
    icon: User,
    title: "Profile Reviews",
    desc: "Get actionable feedback on your dating profile. Know exactly what to change and why.",
    gradient: "from-cappuccino/20 to-transparent",
  },
  {
    icon: Calendar,
    title: "Date Prep",
    desc: "Personalized conversation topics, restaurant suggestions, and follow-up ideas for your date.",
    gradient: "from-paleviolet/15 to-transparent",
  },
  {
    icon: Shield,
    title: "Zero Judgment",
    desc: "100% private, non-judgmental analysis. No screenshots saved. No data shared. Ever.",
    gradient: "from-cappuccino/15 to-transparent",
  },
];

const faqs = [
  {
    q: "Is my data private?",
    a: "Absolutely. We don't store your conversations or screenshots. Analysis happens in real-time and nothing is saved to any database unless you're logged in and choose to save it.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our AI uses advanced language models to analyze tone, intent, and context. While no AI is perfect, our users report 95% satisfaction with the coaching suggestions.",
  },
  {
    q: "Can I use it without signing up?",
    a: "Yes! You get 3 free analyses per month without even creating an account. After that, logging in (free) gives you 3 per month, and Pro plans give unlimited access.",
  },
  {
    q: "What messaging apps does it work with?",
    a: "All of them — Tinder, Bumble, Hinge, WhatsApp, iMessage, Instagram DMs, and any other text-based conversation. Just paste text or upload a screenshot.",
  },
];

/* ─── FAQ ITEM ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left group"
    >
      <div className="flex items-center justify-between py-5 border-b border-antiquewhite/[0.06]">
        <span className="text-sm sm:text-base font-medium text-antiquewhite group-hover:text-paleviolet-light transition-colors pr-8">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-antiquewhite/30 transition-transform duration-300 shrink-0 ${
            open ? "rotate-180 text-paleviolet" : ""
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-antiquewhite/50 leading-relaxed pt-2">
          {a}
        </p>
      </div>
    </button>
  );
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-licorice relative">
      {/* Floating particles */}
      <div className="particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      {/* ═══ FLOATING FEEDBACK ═══ */}
      <FloatingFeedback />

      {/* ═══ NAVIGATION ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-antiquewhite/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="glow" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative z-10 pt-28 sm:pt-32 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="text-center mb-6 opacity-0 animate-fade-up-delay">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-antiquewhite leading-[1.05] tracking-tight mb-6">
              Ready to{" "}
              <span className="text-gradient-hero">
                <TypeWriter words={heroWords} typingSpeed={70} deletingSpeed={40} pauseDuration={2500} />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-antiquewhite/45 max-w-lg mx-auto leading-relaxed opacity-0 animate-fade-up-delay-2">
              Paste a conversation or drop a screenshot — get instant coaching on what to say next.
            </p>
          </div>

          {/* Down arrow hint */}
          <div className="flex justify-center mb-10 opacity-0 animate-fade-up-delay-3">
            <div className="animate-bounce-soft">
              <ChevronDown className="w-5 h-5 text-antiquewhite/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GUEST ANALYZER (THE CORE) ═══ */}
      <section className="relative z-10 px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="relative">
              {/* Glow behind the card */}
              <div className="absolute -inset-4 bg-gradient-radial from-paleviolet/[0.06] to-transparent rounded-3xl blur-xl pointer-events-none" />
              <GuestAnalyzer />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="text-center group">
                    <div className="w-10 h-10 rounded-xl bg-antiquewhite/[0.04] flex items-center justify-center mx-auto mb-3 group-hover:bg-paleviolet/10 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-antiquewhite/30 group-hover:text-paleviolet transition-colors duration-300" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gradient-warm mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-antiquewhite/30">
                      {stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS (NUMBERED STEPS) ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-paleviolet/60 mb-3 font-semibold">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite">
                Three steps to better conversations
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-16 sm:space-y-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 1;
              return (
                <ScrollReveal
                  key={step.num}
                  direction={isEven ? "right" : "left"}
                  delay={i * 100}
                >
                  <div
                    className={`flex flex-col sm:flex-row items-start gap-6 sm:gap-10 ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Step number */}
                    <div className="relative shrink-0">
                      <span className="step-number select-none">
                        {step.num}
                      </span>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-antiquewhite/[0.04] border border-antiquewhite/[0.08] flex items-center justify-center hover-glow">
                        <Icon className="w-6 h-6 text-paleviolet" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-2 sm:pt-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-antiquewhite mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-antiquewhite/40 leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ CHAT PREVIEW / DEMO ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-paleviolet/60 mb-3 font-semibold">
                See it in action
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite">
                From &ldquo;what do I say?&rdquo; to &ldquo;date confirmed&rdquo;
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-lg mx-auto">
            {/* Chat mockup */}
            <ScrollReveal delay={100}>
              <div className="relative p-6 rounded-2xl border border-antiquewhite/[0.06] bg-antiquewhite/[0.02] space-y-4">
                {/* Their message */}
                <div className="flex justify-start">
                  <div className="chat-bubble-left px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-antiquewhite/70">
                      heyy so I was thinking about that coffee place you mentioned
                    </p>
                  </div>
                </div>

                {/* User stuck */}
                <div className="flex justify-end">
                  <div className="chat-bubble-right px-4 py-3 max-w-[80%] opacity-40 border border-dashed border-antiquewhite/10">
                    <p className="text-sm text-antiquewhite/40 italic">
                      what do I say...?
                    </p>
                  </div>
                </div>

                {/* Arrow / AI suggestion */}
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-paleviolet/30" />
                  <div className="px-3 py-1 rounded-full bg-paleviolet/10 border border-paleviolet/20">
                    <span className="text-xs text-paleviolet font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      AI coaching
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-paleviolet/30" />
                </div>

                {/* AI suggested reply */}
                <div className="flex justify-end">
                  <div className="chat-bubble-right px-4 py-3 max-w-[80%] border border-paleviolet/20 shadow-glow-sm">
                    <p className="text-sm text-antiquewhite/90">
                      omg yes! their lavender latte is insane 😍 wanna go this weekend? I know a spot with the best
                      pastries nearby too
                    </p>
                  </div>
                </div>

                {/* Their reply */}
                <div className="flex justify-start">
                  <div className="chat-bubble-left px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-antiquewhite/70">
                      yess!! Saturday works for me 🥰
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-center text-xs text-antiquewhite/20 mt-4">
                Real scenario. Real results.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-paleviolet/60 mb-3 font-semibold">
                Features
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite mb-3">
                Everything you need to{" "}
                <span className="text-gradient">level up</span>
              </h2>
              <p className="text-antiquewhite/35 text-sm max-w-md mx-auto">
                Powerful tools, zero judgment. Sign up to unlock them all.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={i * 100}>
                  <div className="group relative p-6 rounded-2xl border border-antiquewhite/[0.06] bg-antiquewhite/[0.02] hover:border-paleviolet/15 transition-all duration-500 hover-lift overflow-hidden h-full">
                    {/* Hover gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`}
                    />

                    <div className="relative z-10">
                      <div className="w-11 h-11 rounded-xl bg-antiquewhite/[0.05] border border-antiquewhite/[0.08] flex items-center justify-center mb-5 group-hover:border-paleviolet/20 group-hover:bg-paleviolet/10 transition-all duration-300">
                        <Icon className="w-5 h-5 text-antiquewhite/40 group-hover:text-paleviolet transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-antiquewhite mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-antiquewhite/40 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ COMPARISON SECTION ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-paleviolet/60 mb-3 font-semibold">
                Comparison
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite">
                Why choose <span className="text-gradient">us</span>?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <div className="h-full rounded-2xl border border-antiquewhite/[0.06] bg-antiquewhite/[0.02] p-6 sm:p-8">
                <h3 className="text-xs font-bold text-antiquewhite/30 uppercase tracking-[0.15em] mb-6">
                  Asking a friend
                </h3>
                <ul className="space-y-4">
                  {[
                    "Biased or awkward advice",
                    "Not always available",
                    "One perspective only",
                    "Can't analyze tone objectively",
                    "Judgmental sometimes",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-antiquewhite/35"
                    >
                      <span className="w-5 h-5 rounded-full border border-antiquewhite/10 flex items-center justify-center text-[10px] text-antiquewhite/20 shrink-0">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="h-full rounded-2xl border border-paleviolet/20 bg-gradient-to-br from-paleviolet/[0.06] to-transparent p-6 sm:p-8 relative overflow-hidden hover-glow">
                <div className="absolute inset-0 bg-card-glow pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-paleviolet to-cappuccino flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-antiquewhite" />
                    </div>
                    <h3 className="text-xs font-bold text-paleviolet uppercase tracking-[0.15em]">
                      unSent
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Instant, unbiased AI analysis",
                      "Available 24/7, no waiting",
                      "Multiple reply tones to choose",
                      "Reads between the lines",
                      "Zero judgment, maximum help",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-antiquewhite/80"
                      >
                        <span className="w-5 h-5 rounded-full bg-paleviolet/15 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-paleviolet" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ FAQ ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-paleviolet/60 mb-3 font-semibold">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite">
                Common questions
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div>
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-cappuccino/30 via-paleviolet/20 to-licorice" />
              <div className="absolute inset-0 noise-bg" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-radial from-paleviolet/15 to-transparent" />

              <div className="relative z-10 text-center py-16 sm:py-20 px-6 sm:px-12">
                <div className="w-14 h-14 rounded-2xl bg-paleviolet/10 border border-paleviolet/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-6 h-6 text-paleviolet" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-antiquewhite mb-4">
                  Stop overthinking.
                  <br />
                  <span className="text-gradient">Start connecting.</span>
                </h2>
                <p className="text-antiquewhite/40 mb-10 max-w-md mx-auto text-sm leading-relaxed">
                  Join hundreds of people who&apos;ve already improved their dating conversations. Free to start, upgrade anytime.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <Button variant="glow" size="lg" className="text-base px-8">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-sm text-antiquewhite/30 hover:text-antiquewhite/50 transition-colors"
                  >
                    or try it above — no signup needed ↑
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-antiquewhite/[0.04] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-antiquewhite/20 text-xs">
            © 2026 unSent. All rights reserved.
          </p>
          <p className="text-antiquewhite/15 text-[11px] leading-relaxed max-w-lg">
            Disclaimer: AI-generated guidance for informational purposes only. Results not guaranteed. Use responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
