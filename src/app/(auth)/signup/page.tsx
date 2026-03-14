import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export const metadata = {
  title: "Sign Up - unSent",
  description: "Create your unSent account",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-paleviolet/10 to-transparent pointer-events-none" />

      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-antiquewhite">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-antiquewhite/50">
            Start improving your dating life today
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-antiquewhite/50">
          Already have an account?{" "}
          <Link href="/login" className="text-paleviolet hover:text-paleviolet-light transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
