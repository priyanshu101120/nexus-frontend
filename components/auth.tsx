"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button, Card, Input } from "./ui";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
export function Auth({ mode }: { mode: "login" | "register" }) {
  const { login, register, logOut } = useAuth();
  const r = useRouter();
  const [show, setShow] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
      if (mode === "register") {
        await register(name, email, password);

        toast.success("Account created successfully!");

        r.push("/workspace");
      } else {
        await login(email, password);

        toast.success("Login successful!");

        r.push("/workspace");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setErrorMessage(message);
      toast.error(message);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak",
        width: "w-1/4",
        text: "text-red-500",
        bar: "bg-red-500",
      };
    }

    if (score <= 4) {
      return {
        label: "Fair",
        width: "w-2/4",
        text: "text-amber-500",
        bar: "bg-amber-500",
      };
    }

    if (score === 5) {
      return {
        label: "Good",
        width: "w-3/4",
        text: "text-emerald-500",
        bar: "bg-emerald-500",
      };
    }

    return {
      label: "Strong",
      width: "w-full",
      text: "text-emerald-600",
      bar: "bg-emerald-600",
    };
  };
  const passwordStrength = getPasswordStrength(password);
  return (
    <main className="min-h-screen bg-[#f7f7f4] p-4">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-7xl overflow-hidden rounded-[34px] border border-black/5 bg-white shadow-soft lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#111] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <button
            onClick={() => r.push("/")}
            className="w-fit text-xl font-black tracking-[-.05em]"
          >
            NEXUS<span className="text-[#9b91ff]">.</span>
          </button>
          <div className="relative z-10 max-w-lg">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#9b91ff]">
              Your work, connected.
            </p>
            <h1 className="text-6xl font-black tracking-[-.05em]">
              Build momentum.
              <br />
              Keep context.
              <br />
              <span className="text-[#9b91ff]">Ship together.</span>
            </h1>
            <div className="mt-10 space-y-3 text-sm text-white/60">
              {[
                "Projects, tasks and people in one place",
                "Designed for calm, focused collaboration",
                "Ready for your team's next chapter",
              ].map((x) => (
                <div key={x}>
                  <Check size={16} className="mr-2 inline text-[#9b91ff]" />
                  {x}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/30">© 2026 Nexus Studio</p>
          <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[#6D5DFB]/30 blur-[100px]" />
        </section>
        <section className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <button
              onClick={() => r.push("/")}
              className="mb-10 flex items-center gap-2 text-sm text-[#777] lg:hidden"
            >
              <ArrowLeft size={16} />
              Nexus
            </button>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-nexus">
                Nexus workspace
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                {mode === "login" ? "Welcome back." : "Create your workspace."}
              </h2>
              <p className="mt-2 text-sm text-[#777]">
                {mode === "login"
                  ? "Pick up where your team left off."
                  : "Bring projects, tasks and people together."}
              </p>
            </div>
            <Card className="border-0 bg-transparent shadow-none">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">
                      Name
                    </span>
                    <Input
                      placeholder="Priyanshu"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">
                    Email
                  </span>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">
                    Password
                  </span>
                  <div className="relative">
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]"
                    >
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>
                {mode === "register" && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">
                      Confirm password
                    </span>
                    <div className="relative">
                      <Input
                        type={show ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]"
                      >
                        {show ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </label>
                )}
                {mode === "register" && (
                  <div className="rounded-xl bg-black/[.025] p-3 text-xs text-[#777]">
                    <div className="mb-2 flex justify-between">
                      <span>Password strength</span>

                      <b className={passwordStrength.text}>
                        {password ? passwordStrength.label : "Enter password"}
                      </b>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: password
                            ? passwordStrength.width === "w-1/4"
                              ? "25%"
                              : passwordStrength.width === "w-2/4"
                                ? "50%"
                                : passwordStrength.width === "w-3/4"
                                  ? "75%"
                                  : "100%"
                            : "0%",
                        }}
                        transition={{ duration: 0.25 }}
                        className={`h-full rounded-full ${passwordStrength.bar}`}
                      />
                    </div>
                  </div>
                )}
                {mode === "login" && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-black/20"
                      />{" "}
                      Remember me
                    </label>
                    <button type="button" className="font-semibold text-nexus">
                      Forgot password?
                    </button>
                  </div>
                )}
                <Button type="submit" className="w-full py-3">
                  {mode === "login" ? "Login" : "Create account"}
                </Button>
                <div className="flex items-center gap-3 py-2 text-xs text-[#aaa]">
                  <div className="h-px flex-1 bg-black/10" />
                  OR
                  <div className="h-px flex-1 bg-black/10" />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full py-3"
                >
                  Continue with Google
                </Button>
              </form>
            </Card>
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#777]">
              <ShieldCheck size={15} />
              Secure by design
            </div>
            <p className="mt-5 text-center text-sm text-[#777]">
              {mode === "login" ? "New to Nexus?" : "Already have an account?"}{" "}
              <button
                onClick={() =>
                  r.push(mode === "login" ? "/register" : "/login")
                }
                className="font-bold text-nexus"
              >
                {mode === "login" ? "Create account" : "Login"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
