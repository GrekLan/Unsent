"use client";

import { MessageSquare, User, Calendar, Sparkles, UserCircle } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { UsageDisplay } from "@/components/dashboard/UsageDisplay";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

const features = [
  {
    title: "Analyze a Conversation",
    description: "Paste chat or upload screenshot",
    href: "/analyze",
    icon: MessageSquare,
  },
  {
    title: "Improve My Profile",
    description: "Get profile feedback",
    href: "/profile",
    icon: User,
  },
  {
    title: "Prepare for a Date",
    description: "Conversation ideas & follow-up",
    href: "/date-prep",
    icon: Calendar,
  },
  {
    title: "My Account",
    description: "View your profile & history",
    href: "/account",
    icon: UserCircle,
  },
  {
    title: "Upgrade to Pro",
    description: "Unlock unlimited analyses",
    href: "/upgrade",
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  return (
    <Container size="lg" className="py-10 sm:py-12">
      <PageHeader
        eyebrow="Home"
        title="Dashboard"
        description="What would you like to work on today?"
      />

      <UsageDisplay />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature) => (
          <DashboardCard key={feature.href} {...feature} />
        ))}
      </div>
    </Container>
  );
}
