"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  User,
  Mail,
  Crown,
  Calendar,
  MessageSquare,
  FileUser,
  CalendarHeart,
  Clock,
  Edit3,
  Check,
  X,
  Camera,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: string;
  created_at: string;
}

interface AnalysisRecord {
  id: string;
  type: "conversation" | "profile" | "date_prep";
  goal: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, { label: string; icon: typeof MessageSquare; color: string }> = {
  conversation: { label: "Chat Analysis", icon: MessageSquare, color: "text-blue-400" },
  profile: { label: "Profile Review", icon: FileUser, color: "text-green-400" },
  date_prep: { label: "Date Prep", icon: CalendarHeart, color: "text-pink-400" },
};

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  pro_plus: "Pro Plus",
};

export default function AccountPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await fetch("/api/account");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setAnalyses(data.analyses);
        }
      } catch (err) {
        console.error("Failed to fetch account:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, []);

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: editName.trim() }),
      });
      if (res.ok && profile) {
        setProfile({ ...profile, full_name: editName.trim() });
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    setEditName(profile?.full_name || "");
    setIsEditingName(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...profile, avatar_url: data.avatar_url });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload avatar");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return profile?.email?.[0]?.toUpperCase() || "U";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container className="py-10 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-antiquewhite/10 rounded w-48" />
          <div className="h-48 bg-antiquewhite/10 rounded-xl" />
          <div className="h-64 bg-antiquewhite/10 rounded-xl" />
        </div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-10 sm:py-12 text-center">
        <p className="text-antiquewhite/60">Failed to load account data.</p>
      </Container>
    );
  }

  // Group analyses by type for stats
  const stats = {
    conversation: analyses.filter((a) => a.type === "conversation").length,
    profile: analyses.filter((a) => a.type === "profile").length,
    date_prep: analyses.filter((a) => a.type === "date_prep").length,
    total: analyses.length,
  };

  return (
    <Container className="py-10 sm:py-12">
      <PageHeader
        eyebrow="Account"
        title="My Account"
        description="Manage your profile and view your history."
        className="mb-8"
      />

      {/* Profile Info */}
      <Card className="mb-8">
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5 pb-4 border-b border-antiquewhite/10">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-antiquewhite/20">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-cappuccino flex items-center justify-center text-antiquewhite text-2xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 w-20 h-20 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploadingAvatar ? (
                  <div className="w-6 h-6 border-2 border-antiquewhite/40 border-t-antiquewhite rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-antiquewhite" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <div>
              <p className="text-xl font-bold text-antiquewhite">{profile.full_name || profile.email.split("@")[0]}</p>
              <p className="text-sm text-antiquewhite/50">{profile.email}</p>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-paleviolet" />
              <div>
                <p className="text-xs text-antiquewhite/50 uppercase tracking-wide">Name</p>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      className="w-48 py-1 text-sm"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-antiquewhite font-medium">
                    {profile.full_name || "Not set"}
                  </p>
                )}
              </div>
            </div>
            {!isEditingName && (
              <button
                onClick={startEditing}
                className="text-antiquewhite/40 hover:text-paleviolet transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-paleviolet" />
            <div>
              <p className="text-xs text-antiquewhite/50 uppercase tracking-wide">Email</p>
              <p className="text-antiquewhite font-medium">{profile.email}</p>
            </div>
          </div>

          {/* Subscription */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-paleviolet" />
              <div>
                <p className="text-xs text-antiquewhite/50 uppercase tracking-wide">Plan</p>
                <p className="text-antiquewhite font-medium">
                  {TIER_LABELS[profile.subscription_tier] || profile.subscription_tier}
                </p>
              </div>
            </div>
            {profile.subscription_tier === "free" && (
              <Link
                href="/upgrade"
                className="text-sm text-paleviolet hover:underline"
              >
                Upgrade
              </Link>
            )}
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-paleviolet" />
            <div>
              <p className="text-xs text-antiquewhite/50 uppercase tracking-wide">Member since</p>
              <p className="text-antiquewhite font-medium">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Stats */}
      <h2 className="text-xl font-semibold text-antiquewhite mb-4">Usage Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-antiquewhite">{stats.total}</p>
          <p className="text-xs text-antiquewhite/50 mt-1">Total</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.conversation}</p>
          <p className="text-xs text-antiquewhite/50 mt-1">Chats</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-400">{stats.profile}</p>
          <p className="text-xs text-antiquewhite/50 mt-1">Profiles</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-pink-400">{stats.date_prep}</p>
          <p className="text-xs text-antiquewhite/50 mt-1">Date Preps</p>
        </Card>
      </div>

      {/* Analysis History */}
      <h2 className="text-xl font-semibold text-antiquewhite mb-4">History</h2>
      {analyses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-antiquewhite/20 mx-auto mb-3" />
            <p className="text-antiquewhite/50">No analyses yet.</p>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="mt-4">
                Start your first analysis
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => {
            const typeInfo = TYPE_LABELS[analysis.type] || {
              label: analysis.type,
              icon: MessageSquare,
              color: "text-antiquewhite/60",
            };
            const Icon = typeInfo.icon;

            return (
              <Card key={analysis.id} className="flex items-center gap-4 py-3">
                <div className={`flex-shrink-0 ${typeInfo.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-antiquewhite">
                    {typeInfo.label}
                  </p>
                  {analysis.goal && (
                    <p className="text-xs text-antiquewhite/50 truncate">
                      Goal: {analysis.goal}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-xs text-antiquewhite/40">
                  {formatDateTime(analysis.created_at)}
                </div>
                {analysis.type === "conversation" && (
                  <Link
                    href={`/analyze/results?id=${analysis.id}`}
                    className="flex-shrink-0 text-xs text-paleviolet hover:underline"
                  >
                    View
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
