"use client";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Command,
  GitBranch,
  MessageCircle,
  Search,
  Slack,
  Layers,
  Users,
  BarChart3,
  Play,
  ChevronRight,
} from "lucide-react";
import { Button, Card, Avatar, Progress, Badge } from "../ui";
import { projects, tasks, activities } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { CloudField } from "@designcodeio/threeui/components/CloudField";
import "@designcodeio/threeui/style.css";
const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};
function Nav() {
  const r = useRouter();
  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between backdrop-blur-xl rounded-2xl border border-white/10 bg-transparent px-4 py-3 shadow-soft">
      <button
        onClick={() => scrollTo(0, 0)}
        className="text-lg text-white font-black tracking-[-.06em]"
      >
        NEXUS<span className="text-nexus">.</span>
      </button>
      <div className="hidden items-center gap-7 text-sm font-medium text-[#666] md:flex">
        <a href="#features">Product</a>
        <a href="#workflow">Workflow</a>
        <a href="#analytics">Analytics</a>
        <a href="#integrations">Solutions</a>
        <a href="#pricing">Pricing</a>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden sm:inline-flex"
          onClick={() => r.push("/login")}
        >
          Login
        </Button>
        <Button
          onClick={() => r.push("/register")}
          className="rounded-full px-5"
        >
          Get Started <ArrowRight size={15} />
        </Button>
      </div>
    </nav>
  );
}
function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto max-w-6xl"
    >
      <div className="absolute -inset-8 -z-10 rounded-[50px] bg-[radial-gradient(circle_at_50%_30%,rgba(109,93,251,.25),transparent_58%)] blur-3xl" />
      <Card className="overflow-hidden rounded-[30px] border-white/80 bg-white/85 shadow-[0_40px_120px_rgba(30,25,90,.14)]">
        <div className="flex h-[520px] md:h-[600px]">
          <div className="hidden w-52 border-r border-black/[.06] bg-[#fafafa] p-4 md:block">
            <div className="mb-8 text-xs font-black">
              NEXUS<span className="text-nexus">.</span>
            </div>
            <div className="mb-5 rounded-xl bg-[#6D5DFB]/10 px-3 py-2 text-xs font-semibold text-nexus">
              Nexus Studio
            </div>
            {["Overview", "Projects", "My Tasks", "Members", "Activity"].map(
              (x, i) => (
                <div
                  key={x}
                  className={
                    "mb-1 rounded-xl px-3 py-2 text-xs " +
                    (i === 0 ? "bg-black/5 font-semibold" : "text-[#888]")
                  }
                >
                  {x}
                </div>
              ),
            )}
            <div className="mt-8 border-t border-black/5 pt-4 text-[10px] uppercase tracking-widest text-[#aaa]">
              Pinned
            </div>
            <div className="mt-3 text-xs text-[#777]">Website Redesign</div>
            <div className="mt-2 text-xs text-[#777]">Q4 Launch</div>
          </div>
          <div className="min-w-0 flex-1 p-4 md:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#aaa]">
                  Tuesday, Aug 25
                </div>
                <h3 className="mt-1 text-xl font-bold">
                  Good morning, Priyanshu.
                </h3>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="rounded-xl border px-3 py-2 text-xs text-[#999]">
                  <Search size={13} className="mr-2 inline" />
                  Search
                </div>
                <Avatar name="Priyanshu" size="sm" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Active projects", "24"],
                ["Tasks", "128"],
                ["Completion", "87%"],
              ].map((x) => (
                <div
                  key={x[0]}
                  className="rounded-2xl border border-black/5 bg-white p-4"
                >
                  <p className="text-[11px] text-[#999]">{x[0]}</p>
                  <p className="mt-2 text-2xl font-bold">{x[1]}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_.8fr]">
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <b className="text-sm">My tasks</b>
                  <span className="text-xs text-nexus">View all</span>
                </div>
                {tasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 border-t border-black/5 py-3"
                  >
                    <div className="h-4 w-4 rounded-md border border-black/15" />
                    <span className="flex-1 text-xs font-medium">
                      {t.title}
                    </span>
                    <Badge
                      tone={
                        t.priority === "HIGH"
                          ? "red"
                          : t.priority === "MEDIUM"
                            ? "yellow"
                            : "green"
                      }
                    >
                      {t.priority}
                    </Badge>
                    <Avatar name={t.assignee} size="sm" />
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <b className="text-sm">Activity</b>
                {activities.slice(0, 4).map((a) => (
                  <div key={a[3]} className="mt-4 flex gap-2">
                    <Avatar name={a[0]} size="sm" />
                    <div className="text-[10px] leading-4">
                      <b>{a[0]}</b> {a[1]} <b>{a[2]}</b>
                      <div className="text-[#aaa]">{a[3]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
function Mosaic() {
  return (
    <section id="features" className="mx-auto max-w-6xl py-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-nexus">
          Everything connected
        </p>
        <h2 className=" text-white text-4xl font-bold tracking-tight sm:text-6xl">
          A workspace that moves at the speed of your team.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <M
          title="Team Activity"
          className="md:col-span-4"
          icon={<MessageCircle />}
        >
          <div className="mt-7 space-y-3">
            {activities.slice(0, 3).map((a) => (
              <div
                className="flex gap-2 rounded-xl bg-black/[.025] p-3"
                key={a[3]}
              >
                <Avatar name={a[0]} size="sm" />
                <span className="text-xs">
                  <b>{a[0]}</b> {a[1]} <b>{a[2]}</b>
                </span>
              </div>
            ))}
          </div>
        </M>
        <M
          title="Connected Tools"
          className="md:col-span-3"
          icon={<GitBranch />}
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <Tool icon={<GitBranch />} name="GitHub" />
            <Tool icon={<Slack />} name="Slack" />
            <Tool icon={<Layers />} name="Figma" />
          </div>
        </M>
        <M
          title="Nexus Workspace"
          className="md:col-span-5 md:row-span-2"
          icon={<Layers />}
          big
        >
          <div className="mt-8 rounded-2xl bg-[#111] p-4 text-white">
            <div className="flex justify-between text-xs">
              <span>Website Redesign</span>
              <span>74%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-full w-[74%] rounded-full bg-[#9b91ff]" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {["Plan", "Build", "Review", "Ship"].map((x, i) => (
                <div key={x} className="rounded-xl bg-white/5 p-3">
                  <span className="text-[10px] text-white/45">0{i + 1}</span>
                  <p className="mt-2 text-xs font-semibold">{x}</p>
                </div>
              ))}
            </div>
          </div>
        </M>
        <M title="Productivity" className="md:col-span-4" icon={<BarChart3 />}>
          <div className="mt-7 flex items-end gap-2 h-24">
            {[35, 55, 42, 70, 63, 84, 72, 96].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-[#d9d4ff] to-[#6D5DFB]"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </M>
        <M title="Global Search" className="md:col-span-3" icon={<Search />}>
          <div className="mt-6 rounded-xl border bg-white p-3 text-xs text-[#aaa]">
            <Search size={14} className="mr-2 inline" />
            Search Nexus...{" "}
            <kbd className="float-right rounded bg-black/5 px-1.5 py-1">⌘K</kbd>
          </div>
        </M>
      </div>
    </section>
  );
}
function M({
  title,
  icon,
  className = "",
  children,
  big,
}: {
  title: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={
        "rounded-[28px] border border-black/[.07] bg-white p-6 shadow-soft " +
        className
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs text-[#999]">Designed for focus.</p>
        </div>
        <div
          className={
            "grid h-10 w-10 place-items-center rounded-xl " +
            (big ? "bg-white/10 text-white" : "bg-[#6D5DFB]/10 text-nexus")
          }
        >
          {icon}
        </div>
      </div>
      {children}
    </motion.div>
  );
}
function Tool({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs shadow-sm">
      {icon}
      {name}
    </div>
  );
}
function Kanban() {
  return (
    <section className="mx-auto max-w-6xl py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-nexus">
            Task management
          </p>
          <h2 className="text-white text-4xl font-bold tracking-tight sm:text-5xl">
            From idea to done. Without the chaos.
          </h2>
          <p className="mt-5 leading-7 text-[#737373]">
            Give every task a clear owner, priority and next step. Your team
            sees the same work, in the same place.
          </p>
          <div className="text-white mt-7 space-y-3 text-sm">
            {[
              "Clear ownership",
              "Flexible workflows",
              "Comments in context",
              "Deadlines that stay visible",
            ].map((x) => (
              <div key={x}>
                <Check size={16} className="mr-2 inline text-nexus" />
                {x}
              </div>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden p-4">
          <div className="mb-4 flex items-center justify-between">
            <b className="text-sm">Website Redesign</b>
            <Button variant="secondary" className="px-3 py-2 text-xs">
              + Add task
            </Button>
          </div>
          <div className="grid min-w-[650px] grid-cols-4 gap-3 overflow-x-auto">
            {["TODO", "IN PROGRESS", "REVIEW", "DONE"].map((col) => (
              <div key={col} className="rounded-2xl bg-[#f7f7f4] p-2">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#999]">
                    {col}
                  </span>
                  <span className="text-[10px] text-[#aaa]">2</span>
                </div>
                {tasks
                  .filter((t) => t.status === col)
                  .slice(0, 2)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="mb-2 rounded-xl border bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <p className="text-xs font-semibold">{t.title}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          tone={
                            t.priority === "HIGH"
                              ? "red"
                              : t.priority === "MEDIUM"
                                ? "yellow"
                                : "green"
                          }
                        >
                          {t.priority}
                        </Badge>
                        <Avatar name={t.assignee} size="sm" />
                      </div>
                      <p className="mt-2 text-[10px] text-[#aaa]">
                        {t.dueDate} · {t.comments} comments
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
function Analytics() {
  return (
    <section id="analytics" className="bg-[#111] py-28 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#9b91ff]">
              Analytics
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Know where the work stands.
            </h2>
            <p className="mt-5 max-w-xl text-white/55">
              Progress without the spreadsheet archaeology. Nexus turns your
              work into a clear operating picture.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Tasks completed", "128"],
              ["In progress", "24"],
              ["Completion rate", "87%"],
              ["Team velocity", "+18%"],
            ].map((x) => (
              <div
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                key={x[0]}
              >
                <p className="text-xs text-white/45">{x[0]}</p>
                <p className="mt-3 text-3xl font-bold">{x[1]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[.04] p-5">
          <div className="flex h-56 items-end gap-2">
            {[30, 42, 36, 55, 48, 68, 58, 78, 74, 90, 82, 96].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-[#6D5DFB]/30 to-[#9b91ff]"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-6xl py-28">
      <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-nexus">
            Workflow
          </p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
            One flow. Four moments.
          </h2>
        </div>
        <div className="space-y-2">
          {["PLAN", "BUILD", "COLLABORATE", "SHIP"].map((x, i) => (
            <motion.div
              key={x}
              whileHover={{ x: 6 }}
              className="group flex items-center gap-5 rounded-3xl border border-black/[.07] bg-white p-5 transition hover:shadow-soft"
            >
              <span className="text-xs font-bold text-nexus">0{i + 1}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{x}</h3>
                <p className="mt-1 text-sm text-[#888]">
                  Turn the next important thing into a shared, visible step.
                </p>
              </div>
              <ChevronRight className="text-[#bbb] transition group-hover:text-nexus" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="border-t border-black/5 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <b className="text-xl">
            NEXUS<span className="text-nexus">.</span>
          </b>
          <p className="mt-3 max-w-xs text-sm text-[#777]">
            Everything your team needs. Connected in one place.
          </p>
        </div>
        {[
          ["Product", "Features", "Workflow", "Pricing"],
          ["Resources", "Documentation", "Guides", "Changelog"],
          ["Company", "About", "Contact", "Careers"],
        ].map((col) => (
          <div key={col[0]}>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest">
              {col[0]}
            </p>
            {col.slice(1).map((x) => (
              <p key={x} className="mb-3 text-sm text-[#777]">
                {x}
              </p>
            ))}
          </div>
        ))}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest">
            Social
          </p>
          <p className="text-sm text-[#777]">GitHub · X · LinkedIn</p>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-black/5 px-4 pt-6 text-xs text-[#999]">
        © 2026 Nexus. Built for modern teams.
      </div>
    </footer>
  );
}
export function Landing() {
  const r = useRouter();
  return (
    <div className="overflow-hidden bg-black">
      <Nav />
      <section className="relative grid-bg px-4 pb-20 pt-36 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div style={{ width: "100%", height: "700px", position: "relative" }}>
            <CloudField mode="dark" />
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-5xl text-white font-black tracking-[-.06em] sm:text-7xl lg:text-[92px] lg:leading-[.98]"
          >
            Build. Organize.
            <br />
            <span className="bg-gradient-to-r from-[#6D5DFB] via-[#8b7cff] to-[#55b6ff] bg-clip-text text-transparent">
              Move forward.
            </span>{" "}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white sm:text-lg"
          >
            Your team's work.
            <br />
            Finally CONNECTED.
          </motion.p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              className="rounded-full px-6 py-3"
              onClick={() => r.push("/register")}
            >
              Start building <ArrowRight size={16} />
            </Button>
            <Button
              variant="secondary"
              className="rounded-full px-6"
              onClick={() =>
                document
                  .getElementById("preview")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Play size={15} />
              Explore Nexus
            </Button>
          </div>
        </div>
      </section>
      <Mosaic />
      <Kanban />
      <section className="mx-auto max-w-6xl py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-8 sm:p-10">
            <MessageCircle className="text-nexus" />
            <h2 className="mt-8 text-3xl font-bold">
              Work together, without working over each other.
            </h2>
            <div className="mt-7 space-y-3">
              {activities.map((a) => (
                <div
                  key={a[3]}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  <Avatar name={a[0]} size="sm" />
                  <p className="text-xs">
                    <b>{a[0]}</b> {a[1]} {a[2]}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-[#f0edff] to-[#e8f7ff] p-8 sm:p-10">
            <Users className="text-nexus" />
            <h2 className="mt-8 text-3xl font-bold">
              People, context and progress in the same frame.
            </h2>
            <div className="mt-8 flex -space-x-2">
              {["Priyanshu", "Rahul", "Aditi", "Aman", "Maya"].map((x) => (
                <Avatar key={x} name={x} size="lg" />
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-white/70 p-4">
              <p className="text-xs text-[#777]">Workspace velocity</p>
              <div className="mt-4">
                <Progress value={82} />
              </div>
              <p className="mt-2 text-right text-xs font-semibold">
                +18% this month
              </p>
            </div>
          </Card>
        </div>
      </section>
      <Workflow />
      <Analytics />
      <section
        id="integrations"
        className="mx-auto max-w-6xl px-4 py-28 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[.2em] text-nexus">
          Integrations
        </p>
        <h2 className="mt-3 text-4xl font-bold sm:text-6xl">
          Your tools. One connected workflow.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {["GitHub", "Slack", "Notion", "Figma", "Google Drive"].map((x) => (
            <div
              key={x}
              className="float rounded-2xl border bg-white px-5 py-4 text-sm font-semibold shadow-sm"
            >
              {x}
            </div>
          ))}
        </div>
      </section>
      <section
        id="pricing"
        className="mx-4 mb-24 overflow-hidden rounded-[36px] bg-[#6D5DFB] text-white"
      >
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.22),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(120,220,255,.22),transparent_30%)]" />
          <div className="relative">
            <h2 className="text-4xl font-black sm:text-6xl">
              Your team's next chapter starts here.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              A calm operating system for projects, people and progress.
            </p>
            <Button
              className="mt-8 rounded-full bg-white px-7 text-[#111] hover:bg-white/90"
              onClick={() => r.push("/register")}
            >
              Create your workspace <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
