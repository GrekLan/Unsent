import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { CheckCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Login - unSent",
  description: "Sign in to your unSent account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const isConfirmed = params.confirmed === "true";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-paleviolet/10 to-transparent pointer-events-none" />

      <Card className="w-full max-w-md relative z-10">
        {/* ✅ Email confirmed banner */}
        {isConfirmed && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-300">
                You have been signed up successfully!
              </p>
              <p className="text-xs text-emerald-400/70 mt-0.5">
                Please sign in now to get started.
              </p>
            </div>
          </div>
        )}

        {/* ⚠️ Error banners */}
        {error === "link_expired" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">
                Confirmation link expired
              </p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Your email link has expired. Please try signing up again to receive a new one.
              </p>
            </div>
          </div>
        )}

        {error === "invalid_link" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">
                Invalid confirmation link
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">
                The link you clicked is invalid. Please check your email or sign up again.
              </p>
            </div>
          </div>
        )}

        {error === "auth_callback_error" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">
                Authentication failed
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">
                Something went wrong during sign-in. Please try again.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-antiquewhite">Welcome back</h1>
          <p className="mt-2 text-sm text-antiquewhite/50">
            Sign in to continue your journey
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-antiquewhite/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-paleviolet hover:text-paleviolet-light transition-colors">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
