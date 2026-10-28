"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Eye, EyeOff } from "lucide-react";
import {
  saveCredential,
  getCredential,
  getRegisteredUser,
  saveRegisteredUser,
} from "@/data/storage";
import { loginUserApi, registerUserApi, resetPasswordApi } from "@/data/api";

export type AuthSuccessData = {
  type: "signin" | "signup";
  role: string;
  name?: string;
  email?: string;
};

interface AuthPageProps {
  view: "signin" | "signup";
  onClose: () => void;
  onViewChange: (view: "signin" | "signup") => void;
  onSuccess?: (data: AuthSuccessData) => void;
}

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*]/,
    "Password must contain at least one special character (!@#$%^&*)",
  );

const signInSchema = z.object({
  email: z.string().min(1, "Please enter your email or username"),
  password: z.string().min(1, "Please enter your password"),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[\d\s\-+()]+$/.test(val),
        "Invalid phone number",
      ),
    password: passwordValidation,
    confirmPassword: passwordValidation,
    role: z.enum(
      ["builder", "founder", "investor", "Enterprise", "learner"],
      {
        message: "Please select a role",
      },
    ),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4001" : "");

export default function AuthPage({
  view,
  onClose,
  onViewChange,
  onSuccess,
}: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSignup, setPendingSignup] = useState<
    (SignUpFormData & { password: string }) | null
  >(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [resetStep, setResetStep] = useState<
    "email" | "verify" | "password" | null
  >(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetUser, setResetUser] =
    useState<ReturnType<typeof getRegisteredUser>>(undefined);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "builder",
      terms: false,
    },
  });

  // Reset form state when the auth view changes
  useEffect(() => {
    if (view === "signin") {
      signInForm.reset();
    } else {
      signUpForm.reset();
    }
  }, [view, signInForm, signUpForm]);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.({
        type: view === "signup" ? "signup" : "signin",
        role: "builder",
        name: "Google User",
        email: "user@gmail.com",
      });
    }, 400);
  };

  const onSignInSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const emailLower = data.email.toLowerCase().trim();
      // Hash the provided password
      const hash = await hashPassword(data.password);

      // Attempt authentication with MongoDB backend first
      const dbAuth = await loginUserApi({ email: emailLower, hash });
      if (dbAuth.data && dbAuth.data.success) {
        const u = dbAuth.data.user;
        saveRegisteredUser({
          email: u.email,
          hash,
          name: u.name,
          phone: u.phone,
          registeredRole: u.registeredRole,
          verifiedAt: u.verifiedAt,
        });

        setTimeout(() => {
          setIsLoading(false);
          onSuccess?.({
            type: "signin",
            role: u.registeredRole,
            email: u.email,
            name: u.name,
          });
        }, 300);
        return;
      }

      // Check for Admin credentials
      if (
        emailLower === "novafuturegrid@gmail.com" ||
        emailLower === "novafuturegrid"
      ) {
        if (data.password === "nova@admin") {
          localStorage.setItem("nova_admin_authenticated", "true");
          localStorage.setItem("nova_admin_user", "novafuturegrid@gmail.com");
          setTimeout(() => {
            setIsLoading(false);
            onSuccess?.({
              type: "signin",
              role: "admin",
              email: "novafuturegrid@gmail.com",
              name: "Nova Overseer Admin",
            });
          }, 300);
          return;
        } else {
          signInForm.setError("password", {
            type: "manual",
            message: "Incorrect password",
          });
          setIsLoading(false);
          return;
        }
      }

      // Fallback to local storage credentials & seed accounts
      const registeredUser = getRegisteredUser(emailLower);
      const stored = registeredUser || getCredential(emailLower);

      // Support platform seed accounts directly
      const isSeedBuilder = [
        "emeka@nova.dev",
        "amara@nova.dev",
        "raj@nova.dev",
        "david.okafor@nova.africa",
        "builder@nova.dev",
      ].includes(emailLower);
      const isSeedCompany = [
        "contact@paypulse.io",
        "talent@healthbridge.ng",
        "founder@nova.dev",
        "investor@nova.dev",
      ].includes(emailLower);

      if (!stored && !isSeedBuilder && !isSeedCompany) {
        // No account for this email
        signInForm.setError("email", {
          type: "manual",
          message: dbAuth.error || "No account found for this email",
        });
        setIsLoading(false);
        return;
      }
      if (stored && stored.hash !== hash) {
        signInForm.setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
        setIsLoading(false);
        return;
      }

      // Credentials match — proceed with success callback
      setTimeout(() => {
        setIsLoading(false);
        onSuccess?.({
          type: "signin",
          role: registeredUser?.registeredRole || (isSeedCompany ? "founder" : "builder"),
          email: data.email,
        });
      }, 400);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    setVerificationError(null);
    setIsLoading(true);
    try {
      // Request server to send verification code
      const resp = await fetch(`${API_BASE}/api/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, name: data.name }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        signUpForm.setError("email", {
          type: "manual",
          message: body.error || "Failed to send verification code",
        });
        setIsLoading(false);
        return;
      }

      const body = await resp.json().catch(() => ({}));
      setVerificationToken(body.token || null);
      if (body.devCode) {
        setVerificationCode(body.devCode);
      }

      // Keep signup data locally until verification completes
      setPendingSignup({ ...(data as any) });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setVerificationError(
        "Unable to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!pendingSignup) return;
    setVerificationError(null);
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingSignup.email,
          code: verificationCode,
          token: verificationToken,
        }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        setVerificationError(
          body.error ||
            "Verification failed. Please check the code and try again.",
        );
        setIsLoading(false);
        return;
      }

      // Verified — save credential to MongoDB and local storage
      const hash = await hashPassword(pendingSignup.password as string);
      
      // Save to MongoDB
      registerUserApi({
        email: pendingSignup.email,
        hash,
        name: pendingSignup.name,
        phone: pendingSignup.phone,
        registeredRole: pendingSignup.role,
      }).catch((err) => console.warn("Failed to persist user to MongoDB:", err));

      saveRegisteredUser({
        email: pendingSignup.email,
        hash,
        name: pendingSignup.name,
        phone: pendingSignup.phone,
        registeredRole: pendingSignup.role,
        verifiedAt: new Date().toISOString(),
      });

      // Callback to parent to continue signup (App will create profile)
      onSuccess?.({
        type: "signup",
        role: pendingSignup.role,
        name: pendingSignup.name,
        email: pendingSignup.email,
      });
      setPendingSignup(null);
      setVerificationCode("");
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setVerificationError("Unable to verify code. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingSignup) return;
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/api/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingSignup.email,
          name: pendingSignup.name,
        }),
      });
      const body = await resp.json().catch(() => ({}));
      setVerificationToken(body.token || null);
      if (body.devCode) {
        setVerificationCode(body.devCode);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const startPasswordReset = () => {
    setResetStep("email");
    setResetEmail("");
    setResetError(null);
  };

  const requestPasswordReset = async () => {
    const email = resetEmail.trim().toLowerCase();
    const registeredUser = getRegisteredUser(email);
    const credential = getCredential(email);
    if (!registeredUser && !credential) {
      setResetError("No account found for this email.");
      return;
    }

    setIsLoading(true);
    setResetError(null);
    try {
      const resp = await fetch(`${API_BASE}/api/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setResetError(body.error || "Unable to send verification code.");
        return;
      }
      setResetEmail(email);
      setResetUser(registeredUser);
      setResetToken(body.token || null);
      setResetStep("verify");
    } catch (error) {
      console.error(error);
      setResetError("Unable to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPasswordReset = async () => {
    setIsLoading(true);
    setResetError(null);
    try {
      const resp = await fetch(`${API_BASE}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
          token: resetToken,
        }),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setResetError(
          body.error ||
            "Verification failed. Please check the code and try again.",
        );
        return;
      }
      setResetStep("password");
      setResetCode("");
    } catch (error) {
      console.error(error);
      setResetError("Unable to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const finishPasswordReset = async () => {
    const passwordResult = passwordValidation.safeParse(resetPassword);
    if (!passwordResult.success) {
      setResetError(
        passwordResult.error.issues[0]?.message ||
          "Please enter a valid password.",
      );
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setResetError(null);
    try {
      const hash = await hashPassword(resetPassword);
      // Update in MongoDB
      resetPasswordApi(resetEmail, hash).catch(() => {});
      
      if (resetUser) {
        saveRegisteredUser({ ...resetUser, hash });
      } else {
        saveCredential(resetEmail, hash);
      }
      setResetStep(null);
      setResetPassword("");
      setResetConfirmPassword("");
      setResetToken(null);
      setResetError(null);
      signInForm.reset({ email: resetEmail, password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple SHA-256 hashing helper using Web Crypto
  async function hashPassword(pw: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(pw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

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
                {view === "signin" ? "Welcome back" : "Start building proof"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {view === "signin"
                  ? "Sign in to continue building your proof"
                  : "Join the trust infrastructure for verified talent"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full text-slate-400 hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-white/10 bg-[#0f0f11]/50 backdrop-blur-sm p-8 shadow-xl shadow-indigo-500/10">
          {view === "signin" && resetStep ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {resetStep === "email"
                    ? "Reset your password"
                    : resetStep === "verify"
                      ? "Verify your email"
                      : "Create a new password"}
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  {resetStep === "email"
                    ? "Enter the email address used to create your account."
                    : resetStep === "verify"
                      ? `We've sent a verification code to ${resetEmail}.`
                      : "Choose a new password for your account."}
                </p>
              </div>
              {resetError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {resetError}
                </div>
              )}
              {resetStep === "email" && (
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
              )}
              {resetStep === "verify" && (
                <Input
                  value={resetCode}
                  onChange={(event) =>
                    setResetCode(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit code"
                  className="bg-white/5 border-white/10 text-white"
                  disabled={isLoading}
                />
              )}
              {resetStep === "password" && (
                <div className="space-y-4">
                  <Input
                    type="password"
                    value={resetPassword}
                    onChange={(event) => setResetPassword(event.target.value)}
                    placeholder="New password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  <Input
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(event) =>
                      setResetConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm new password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>
              )}
              <Button
                type="button"
                onClick={
                  resetStep === "email"
                    ? requestPasswordReset
                    : resetStep === "verify"
                      ? verifyPasswordReset
                      : finishPasswordReset
                }
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold h-10"
                disabled={isLoading}
              >
                {isLoading
                  ? "Please wait..."
                  : resetStep === "email"
                    ? "Send verification code"
                    : resetStep === "verify"
                      ? "Verify email"
                      : "Update password"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-400 hover:text-white"
                onClick={() => {
                  setResetStep(null);
                  setResetError(null);
                }}
                disabled={isLoading}
              >
                Back to sign in
              </Button>
            </div>
          ) : view === "signin" ? (
            <Form key={view} {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={startPasswordReset}
                  className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0f0f11] text-slate-500">or</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5 cursor-pointer"
                    disabled={isLoading}
                    onClick={handleGoogleAuth}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5"
                    disabled={isLoading}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .5A12 12 0 0 0 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 2-1.1-.9-.1-1.9-.4-1.9-1.9 0-.4.1-.7.3-1-.3-.1-1.1-.4-3.6 1.4-.9-.3-1.8-1-1.8-2.2 0-.5.2-1 .6-1.3 0 0 .5-.1 1.7.6.5-.1 1-.2 1.6-.2.5 0 1.1.1 1.6.2 1.2-.8 1.7-.6 1.7-.6.4.3.6.8.6 1.3 0 1.2-.9 1.9-1.8 2.2 0 .1.1.3.1.6v2.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5" />
                    </svg>
                    Sign in with GitHub
                  </Button>
                </div>
              </form>
            </Form>
          ) : pendingSignup ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Enter verification code</h3>
              <p className="text-sm text-slate-400">
                We've sent a 6-digit code to{" "}
                <span className="text-white">{pendingSignup.email}</span>. Enter
                it below to verify your email.
              </p>
              {verificationError ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {verificationError}
                </div>
              ) : null}
              <div>
                <Input
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit code"
                  className="bg-white/5 border-white/10 text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleVerifyCode}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Verify code
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  Resend
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPendingSignup(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Form key={view} {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Phone Number{" "}
                        <span className="text-xs text-slate-500">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">I am a</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0f0f11] border-white/10 text-white">
                          <SelectItem
                            value="builder"
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            Builder
                          </SelectItem>
                          <SelectItem
                            value="founder"
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            Founder
                          </SelectItem>
                          <SelectItem
                            value="investor"
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            Investor
                          </SelectItem>
                          <SelectItem
                            value="Enterprise"
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            Enterprise
                          </SelectItem>
                          <SelectItem
                            value="learner"
                            className="focus:bg-white/10 focus:text-white cursor-pointer"
                          >
                            Learner
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            setTermsAccepted(Boolean(value));
                          }}
                          className="border-slate-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-300 text-sm font-normal">
                          I agree to the Terms of Service and Privacy Policy
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {verificationError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                    {verificationError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !termsAccepted}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0f0f11] text-slate-500">or</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5"
                    disabled={isLoading}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/5 cursor-pointer"
                    disabled={isLoading}
                    onClick={handleGoogleAuth}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .5A12 12 0 0 0 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 2-1.1-.9-.1-1.9-.4-1.9-1.9 0-.4.1-.7.3-1-.3-.1-1.1-.4-3.6 1.4-.9-.3-1.8-1-1.8-2.2 0-.5.2-1 .6-1.3 0 0 .5-.1 1.7.6.5-.1 1-.2 1.6-.2.5 0 1.1.1 1.6.2 1.2-.8 1.7-.6 1.7-.6.4.3.6.8.6 1.3 0 1.2-.9 1.9-1.8 2.2 0 .1.1.3.1.6v2.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5" />
                    </svg>
                    Sign up with GitHub
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Toggle View */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-slate-400 text-sm">
              {view === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() =>
                  onViewChange(view === "signin" ? "signup" : "signin")
                }
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                {view === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            By signing {view === "signin" ? "in" : "up"}, you agree to our Terms
            of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
