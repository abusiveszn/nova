"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, ArrowLeft } from "lucide-react";

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBackToSignup: () => void;
  onResendCode?: () => void;
  verificationCode: string; // The actual code to verify against
}

export default function EmailVerification({
  email,
  onVerified,
  onBackToSignup,
  onResendCode,
  verificationCode,
}: EmailVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  // Countdown timer for resend button
  useEffect(() => {
    if (!resendDisabled) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendDisabled]);

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    setVerificationError(null);

    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verify the code
      if (data.code === verificationCode) {
        onVerified();
      } else {
        setVerificationError(
          "Invalid verification code. Please check and try again.",
        );
        form.reset();
      }
    } catch (error) {
      console.error(error);
      setVerificationError("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      // Simulate resend delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the callback if provided
      if (onResendCode) {
        onResendCode();
      }

      // Enable the timer
      setResendDisabled(true);
      setTimeLeft(60);
    } catch (error) {
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f0f11] text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20">
              <img
                src="/Picsart_26-04-10_14-37-41-214.png"
                alt="NOVA Logo"
                className="w-full h-full object-contain bg-[#0a0a0a] p-1"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300/80">
                NOVA
              </p>
              <h1 className="text-3xl font-black text-white leading-tight">
                Verify your email
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                We've sent a code to your Gmail
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full text-slate-400 hover:bg-white/5"
            onClick={onBackToSignup}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-white/10 bg-[#0f0f11]/50 backdrop-blur-sm p-8 shadow-xl shadow-indigo-500/10">
          {/* Email Info */}
          <div className="mb-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3">
            <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-300">
                Verification code sent to
              </p>
              <p className="text-sm text-white font-semibold">{email}</p>
            </div>
          </div>

          {/* Error Message */}
          {verificationError && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {verificationError}
            </div>
          )}

          {/* Verification Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="000000"
                        inputMode="numeric"
                        maxLength={6}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 text-center text-2xl tracking-widest font-mono"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold h-10"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </Form>

          {/* Resend Code */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-slate-400 mb-4">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5"
              disabled={resendDisabled || resendLoading}
              onClick={handleResendCode}
            >
              {resendDisabled
                ? `Resend in ${timeLeft}s`
                : resendLoading
                  ? "Sending..."
                  : "Resend Code"}
            </Button>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            className="w-full mt-3 text-slate-400 hover:text-slate-300 hover:bg-white/5"
            onClick={onBackToSignup}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Enter the 6-digit code sent to your email address. It may take a few
          seconds to arrive.
        </p>
      </div>
    </div>
  );
}
