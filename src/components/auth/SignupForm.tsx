"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // Show confirmation message instead of redirecting
    setUserEmail(data.email);
    setEmailSent(true);
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (oAuthError) {
      setError(oAuthError.message);
      setIsGoogleLoading(false);
    }
  };

  // Show confirmation message after successful signup
  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-antiquewhite mb-2">
            Check your email!
          </h3>
          <p className="text-antiquewhite/70">
            We&apos;ve sent a confirmation link to:
          </p>
          <p className="text-paleviolet font-medium mt-1 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            {userEmail}
          </p>
        </div>
        
        <div className="bg-cappuccino/20 rounded-lg p-4 text-sm text-antiquewhite/80">
          <p>
            Click the link in your email to verify your account, then come back here to sign in.
          </p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-antiquewhite/60 mb-3">
            Already confirmed?
          </p>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Go to Sign In
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-antiquewhite/50">
          Didn&apos;t receive the email? Check your spam folder or try signing up again.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isGoogleLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-antiquewhite/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-antiquewhite/10 text-antiquewhite/60">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? "Connecting..." : "Sign up with Google"}
      </Button>
    </form>
  );
}
