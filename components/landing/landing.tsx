"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Kanban,
  Users,
  MessageSquare,
  ShieldCheck,
  Zap,
  GitBranch,
  Plus,
  ChevronDown,
  Layers,
  UserPlus,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export function Landing() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f4] text-[#111] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Import Editorial Serif Fonts matching the reference image */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-hero-serif {
          font-family: 'Instrument Serif', 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <NavBar />
      <Hero />
      <MockBoardPreview />
      <HowItWorks />
      <FeatureGrid />
      <ValueStrip />
      <GetStartedSteps />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ============================= NAV (Fully Transparent) ============================= */

function NavBar() {
  const router = useRouter();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="text-lg font-black tracking-[-.05em]">
          NEXUS<span className="text-[#6d5dfb]">.</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-black/70 md:flex">
          <a href="#how-it-works" className="transition hover:text-black">
            How it works
          </a>
          <a href="#features" className="transition hover:text-black">
            Features
          </a>
          <a href="#faq" className="transition hover:text-black">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/login")}
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5 sm:block"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="flex items-center gap-1.5 rounded-xl bg-[#6d5dfb] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#101d46]"
          >
            Get started <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* ============================= HERO (Editorial Typography) ============================= */

function Hero() {
  const router = useRouter();
  const bgImg = "/cfbef7ee6088cac3e2e6c01cfe57bfed.png";

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center px-5 pb-16 pt-32 sm:px-8 sm:pt-36 flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('${bgImg}')` }}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl text-center z-10"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-xs font-medium text-black/70 backdrop-blur-md shadow-sm"
        >
          <Zap size={13} className="text-[#6d5dfb]" />
          Built for fast-moving teams
        </motion.div>

        {/* Updated Font Styling matching attached image */}
        <motion.h1
          variants={fadeUp}
          className="font-hero-serif text-5xl font-normal leading-[1.08] tracking-[-0.02em] text-[#111] sm:text-7xl lg:text-[82px]"
        >
          Organize <span className="text-[#6d5dfb]/50 font-light">work.</span>
          <br />
          Ship <span className="text-white italic font-normal">faster</span>,
          <span className="text-black/40 font-light">together.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base font-normal tracking-wide"
        >
          Nexus brings workspaces, boards, tasks and your whole team into one
          calm place — so nothing falls through the cracks.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => router.push("/register")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6d5dfb] px-8 py-3.5 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-black sm:w-auto shadow-md"
          >
            Get started free <ArrowRight size={15} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-full border border-black/10 bg-white/80 backdrop-blur-md px-7 py-3.5 text-sm font-medium text-black/80 transition hover:bg-white sm:w-auto shadow-sm"
          >
            Log in
          </button>
        </motion.div>

        {/* <motion.p variants={fadeUp} className="mt-4 text-xs font-medium text-black/40">
          No credit card required · Free while in early access
        </motion.p> */}
      </motion.div>
    </section>
  );
}

/* ===================== MOCK BOARD PREVIEW ===================== */

function MockBoardPreview() {
  const columns = [
    {
      name: "TODO",
      color: "#c9c9c9",
      tasks: [
        { title: "Design onboarding flow", tag: "MEDIUM", tagColor: "#f59e0b" },
        { title: "Write API docs", tag: "LOW", tagColor: "#22c55e" },
      ],
    },
    {
      name: "IN PROGRESS",
      color: "#6d5dfb",
      tasks: [
        { title: "Build invite flow", tag: "HIGH", tagColor: "#ef4444" },
        { title: "Fix drag-drop bug", tag: "HIGH", tagColor: "#ef4444" },
      ],
    },
    {
      name: "DONE",
      color: "#22c55e",
      tasks: [
        { title: "Set up workspace roles", tag: "MEDIUM", tagColor: "#f59e0b" },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto -mt-10 max-w-5xl px-5 sm:px-8 z-20"
    >
      <div className="rounded-3xl border border-black/[0.07] bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-5">
        <div className="mb-4 flex items-center gap-1.5 px-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {columns.map((col, ci) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.1 }}
              className="rounded-2xl bg-[#f7f7f4] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between px-1.5">
                <span className="text-[10px] font-bold tracking-widest text-black/40">
                  {col.name}
                </span>
                <span className="text-[10px] text-black/25">
                  {col.tasks.length}
                </span>
              </div>
              {col.tasks.map((t) => (
                <div
                  key={t.title}
                  className="mb-2 rounded-xl border border-black/[0.05] bg-white p-3 shadow-sm"
                >
                  <p className="text-xs font-semibold">{t.title}</p>
                  <span
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{
                      backgroundColor: `${t.tagColor}1A`,
                      color: t.tagColor,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================= HOW IT WORKS ============================= */

function HowItWorks() {
  const steps = [
    {
      icon: Layers,
      title: "Create a workspace",
      desc: "Spin up a home for your team in seconds — no setup, no config.",
      bg: "#fef3c7",
      fg: "#d97706",
    },
    {
      icon: Kanban,
      title: "Organize with boards",
      desc: "Every project gets its own Kanban board with columns and tasks, ready to go.",
      bg: "#ede9fe",
      fg: "#6d5dfb",
    },
    {
      icon: UserPlus,
      title: "Bring your team in",
      desc: "Invite members, assign roles, and start moving work forward together.",
      bg: "#dbeafe",
      fg: "#2563eb",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-14 max-w-xl text-center"
      >
        <h2 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Up and running in three steps
        </h2>
        <p className="mt-3 text-black/50">
          No lengthy onboarding. Just create, organize, and collaborate.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-5 sm:grid-cols-3"
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-black/[0.06] bg-white p-6"
          >
            <div
              className="mb-5 grid h-12 w-12 place-items-center rounded-xl"
              style={{ backgroundColor: s.bg, color: s.fg }}
            >
              <s.icon size={22} />
            </div>
            <p className="mb-2 text-xs font-bold text-black/30">STEP {i + 1}</p>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================= FEATURE GRID ============================= */

function FeatureGrid() {
  const features = [
    {
      icon: Kanban,
      title: "Drag & drop boards",
      desc: "Move tasks across columns instantly — changes save automatically.",
      gradient: "from-[#8b7cff] to-[#6d5dfb]",
    },
    {
      icon: Users,
      title: "Workspaces & roles",
      desc: "Owner, Admin and Member roles keep permissions clear and safe.",
      gradient: "from-[#ff9fd6] to-[#ff6bb3]",
    },
    {
      icon: MessageSquare,
      title: "Task comments",
      desc: "Discuss work right where it happens — no jumping between apps.",
      gradient: "from-[#8bd8ff] to-[#4fb8f0]",
    },
    {
      icon: ShieldCheck,
      title: "Secure invitations",
      desc: "Email-verified invites mean only the right people ever join.",
      gradient: "from-[#a3e6b0] to-[#5fce77]",
    },
    {
      icon: GitBranch,
      title: "Multiple projects",
      desc: "Every workspace can hold as many projects and boards as you need.",
      gradient: "from-[#ffd08b] to-[#f5a63c]",
    },
    {
      icon: Zap,
      title: "Built for speed",
      desc: "A fast, focused interface — no clutter, no distractions.",
      gradient: "from-[#c4b5fd] to-[#8b7cff]",
    },
  ];

  return (
    <section id="features" className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-xl text-center"
        >
          <h2 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            Everything your team needs
          </h2>
          <p className="mt-3 text-black/50">
            Focused features that actually get used — nothing you have to configure for hours.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-black/[0.06] p-6 transition hover:shadow-lg"
            >
              <div
                className={`mb-5 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${f.gradient} text-white`}
              >
                <f.icon size={20} />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================= VALUE STRIP ============================= */

function ValueStrip() {
  const values = [
    { label: "Unlimited workspaces", sub: "No arbitrary limits while you're getting started" },
    { label: "Role-based access", sub: "Owner, Admin and Member permissions built in" },
    { label: "Real task ownership", sub: "Assign, prioritize, and track every task" },
    { label: "Free in early access", sub: "No credit card, no trial countdown" },
  ];

  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#111] px-6 py-12 text-white sm:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((v) => (
            <motion.div key={v.label} variants={fadeUp}>
              <p className="text-lg font-black">{v.label}</p>
              <p className="mt-2 text-sm text-white/45">{v.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================= GET STARTED STEPS ============================= */

function GetStartedSteps() {
  const router = useRouter();
  return (
    <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-3 max-w-md text-black/50">
          Create an account, spin up your first workspace, and invite your team
          — the whole thing takes about two minutes.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mx-auto mt-8 flex items-center gap-2 rounded-xl bg-[#6d5dfb] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#5b4be0]"
        >
          <Plus size={16} /> Create your workspace
        </button>
      </motion.div>
    </section>
  );
}

/* ============================= FAQ ============================= */

function FAQ() {
  const faqs = [
    {
      q: "Is Nexus free to use?",
      a: "Yes — Nexus is free to use while it's in early access. No credit card required to get started.",
    },
    {
      q: "How many projects can I create?",
      a: "As many as you need. Each workspace supports multiple projects, each with its own board.",
    },
    {
      q: "Can I control who sees what?",
      a: "Yes. Workspace roles (Owner, Admin, Member) control who can invite people, manage projects, and change settings.",
    },
    {
      q: "How do invitations work?",
      a: "You invite someone by email; they can only accept the invite by logging in with that exact email address, so invites can't be intercepted.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-3xl font-black tracking-[-0.03em]"
        >
          Frequently asked questions
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-black/[0.07]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold"
              >
                {f.q}
                <motion.span animate={{ rotate: open === i ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-black/40" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: open === i ? "auto" : 0,
                  opacity: open === i ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm leading-6 text-black/55">{f.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= FINAL CTA ============================= */

function FinalCTA() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-[#8b7cff]/20 blur-[100px]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Bring your team's work into one place
        </h2>
        <p className="mx-auto mt-3 max-w-md text-black/50">
          Start free. Invite your team when you're ready.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mx-auto mt-8 flex items-center gap-2 rounded-xl bg-[#111] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
        >
          Get started free <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
}

/* ============================= FOOTER ============================= */

function Footer() {
  const router = useRouter();
  const bgImg = "/cfbef7ee6088cac3e2e6c01cfe57bfed.png";

  return (
    <footer
      className="relative overflow-hidden bg-cover bg-center px-5 pb-8 pt-20 text-white sm:px-8"
      style={{ backgroundImage: `url('${bgImg}')` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7f7f4] via-[#0b1f16]/90 to-[#06120c]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="text-lg font-black tracking-[-.05em]">
              NEXUS<span className="text-[#9b91ff]">.</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/50">
              One calm place for your team's workspaces, boards and tasks.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Product
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#features" className="transition hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Account
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  onClick={() => router.push("/login")}
                  className="transition hover:text-white"
                >
                  Log in
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/login")}
                  className="transition hover:text-white"
                >
                  Get started
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-white/35">
          © 2026 Nexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}