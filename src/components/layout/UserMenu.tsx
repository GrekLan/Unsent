"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LogOut,
  UserCircle,
  Sparkles,
  MessageSquareHeart,
  Camera,
  Crown,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfcZT0c0p-FBZtjBp-gfO554Q4bizN1cL45dOEaUwaV3eJp4g/viewform";

interface UserMenuProps {
  user: User;
}

interface ProfileInfo {
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: string;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  pro_plus: "Pro Plus",
};

const TIER_COLORS: Record<string, string> = {
  free: "text-antiquewhite/50",
  pro: "text-yellow-400",
  pro_plus: "text-pink-400",
};

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/account");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            full_name: data.profile.full_name,
            avatar_url: data.profile.avatar_url || null,
            subscription_tier: data.profile.subscription_tier,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev ? { ...prev, avatar_url: data.avatar_url } : prev
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload avatar");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const tierLabel = TIER_LABELS[profile?.subscription_tier || "free"] || "Free";
  const tierColor = TIER_COLORS[profile?.subscription_tier || "free"] || "text-antiquewhite/50";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-antiquewhite/20 hover:border-paleviolet transition-colors focus:outline-none focus:ring-2 focus:ring-paleviolet focus:ring-offset-2 focus:ring-offset-licorice"
        aria-label="User menu"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-cappuccino flex items-center justify-center text-antiquewhite text-sm font-bold">
            {getInitials()}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-licorice/70 backdrop-blur-xl border border-antiquewhite/10 rounded-2xl shadow-glass overflow-hidden z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-antiquewhite/10">
            <div className="flex items-center gap-3">
              {/* Avatar with upload overlay */}
              <div className="relative group">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-antiquewhite/20">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-cappuccino flex items-center justify-center text-antiquewhite text-lg font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                {/* Camera overlay on hover */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 w-14 h-14 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-antiquewhite/40 border-t-antiquewhite rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-antiquewhite" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Name & Email */}
              <div className="flex-grow min-w-0">
                <p className="text-antiquewhite font-semibold truncate">
                  {displayName}
                </p>
                <p className="text-xs text-antiquewhite/50 truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className={`w-3 h-3 ${tierColor}`} />
                  <span className={`text-xs font-medium ${tierColor}`}>
                    {tierLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <MenuLink
              href="/account"
              icon={<UserCircle className="w-4 h-4" />}
              label="My Account"
              onClick={() => setIsOpen(false)}
            />
            <MenuLink
              href="/upgrade"
              icon={<Sparkles className="w-4 h-4" />}
              label="Upgrade Plan"
              onClick={() => setIsOpen(false)}
            />
            <MenuLink
              href={FEEDBACK_FORM_URL}
              icon={<MessageSquareHeart className="w-4 h-4" />}
              label="Give Feedback"
              external
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Logout */}
          <div className="border-t border-antiquewhite/10 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable menu link */
function MenuLink({
  href,
  icon,
  label,
  external,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const className =
    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-antiquewhite/80 hover:bg-antiquewhite/5 hover:text-antiquewhite transition-colors";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {icon}
      {label}
    </Link>
  );
}
