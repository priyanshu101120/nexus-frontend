"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/Authcontext";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

import loginPicture from "@/public/secondloginimage.png";
import firstloginPicture from "@/public/firstloginimage.png";

type AuthProps = {
  initialMode?: "login" | "register";
  inviteToken?: string | null;
};

export function Auth({ initialMode = "login", inviteToken }: AuthProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const r = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Next.js static import handling (handles object or direct string URL)
  const bgImageUrl = typeof loginPicture === "string" ? loginPicture : loginPicture.src;
  const bgImageUrl2 = typeof firstloginPicture === "string" ? firstloginPicture : firstloginPicture.src;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!name) {
        setErrorMessage("Please enter your name.");
        return;
      }

      if (!confirmPassword) {
        setErrorMessage("Please confirm your password.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "register") {
        await register({ name, email, password });

        toast.success("Account created successfully!");
        if (inviteToken) {
          r.push(`/invitations/${inviteToken}`);
        } else {
          r.push("/workspace");
        }
      } else {
        await login({ email, password });

        toast.success("Login successful!");
        if (inviteToken) {
          r.push(`/invitations/${inviteToken}`);
        } else {
          r.push("/workspace");
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential returned from Google");
      }
      await loginWithGoogle(credentialResponse.credential);
      toast.success("Logged in with Google!");
      r.push("/workspace");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google login failed.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setErrorMessage("");
    setConfirmPassword("");
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2)
      return {
        label: "Weak",
        width: "w-1/4",
        text: "text-red-500",
        bar: "bg-red-500",
      };
    if (score <= 4)
      return {
        label: "Fair",
        width: "w-2/4",
        text: "text-amber-500",
        bar: "bg-amber-500",
      };
    if (score === 5)
      return {
        label: "Good",
        width: "w-3/4",
        text: "text-emerald-500",
        bar: "bg-emerald-500",
      };
    return {
      label: "Strong",
      width: "w-full",
      text: "text-emerald-600",
      bar: "bg-emerald-600",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#008689] p-4"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex min-h-[600px] w-full max-w-4xl overflow-hidden rounded-[18px] bg-white shadow-[0_30px_80px_rgba(2,6,23,0.45)]">
        {/* Left Hero Banner with Background Image */}
        <div
          className="relative hidden w-1/2 overflow-hidden bg-[#0b2f3f] md:block"
          style={{
            backgroundImage: `url(${bgImageUrl2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-[#041a2b]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,transparent_0%,rgba(4,26,43,0.08)_100%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-light tracking-[0.35em] text-white drop-shadow-md">
              WELCOME
            </h1>
            <p className="mt-3 text-xs tracking-widest text-white/80 uppercase">
              Build momentum • Ship together
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex w-full flex-col justify-between bg-[#f4f3f0] px-8 py-8 sm:px-10 md:w-1/2 md:px-12">
          <div className="my-auto w-full max-w-sm">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-[#0f172a]">
              {mode === "login" ? "Login" : "Sign up"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-center text-xs text-red-500">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {mode === "register" && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#0f172a]">Name</label>
                  <input
                    type="text"
                    placeholder="Priyanshu"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-gray-300 bg-transparent pb-2 text-sm text-[#0a1128] outline-none transition placeholder:text-gray-400 focus:border-[#0a1128]"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#0f172a]">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-gray-300 bg-transparent pb-2 text-sm text-[#0a1128] outline-none transition placeholder:text-gray-400 focus:border-[#0a1128]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[#0f172a]">Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Password reset flow coming soon.")
                      }
                      className="text-[11px] font-medium text-[#0a1128] transition hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-[#0a1128] outline-none transition placeholder:text-gray-400 focus:border-[#0a1128]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#0f172a]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-[#0a1128] outline-none transition placeholder:text-gray-400 focus:border-[#0a1128]"
                    />
                  </div>
                </div>
              )}

              {mode === "register" && password && (
                <div className="rounded-xl bg-black/[.025] p-3 text-xs text-[#777]">
                  <div className="mb-1.5 flex justify-between">
                    <span>Password strength</span>
                    <b className={passwordStrength.text}>
                      {passwordStrength.label}
                    </b>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          passwordStrength.width === "w-1/4"
                            ? "25%"
                            : passwordStrength.width === "w-2/4"
                              ? "50%"
                              : passwordStrength.width === "w-3/4"
                                ? "75%"
                                : "100%",
                      }}
                      transition={{ duration: 0.25 }}
                      className={`h-full rounded-full ${passwordStrength.bar}`}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-[#0b1635] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#101d46] disabled:cursor-not-allowed disabled:bg-[#0b1635]/80"
              >
                {loading
                  ? mode === "login"
                    ? "Login..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Login"
                    : "Sign up"}
              </button>

              <div className="flex items-center gap-3 py-1 text-[11px] text-[#aaa]">
                <div className="h-px flex-1 bg-black/10" />
                OR
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google login failed.")}
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              className="cursor-pointer font-bold text-[#050a1c] hover:underline"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}