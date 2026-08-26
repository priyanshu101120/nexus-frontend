"use client";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Plus,
  ArrowUpRight,
  Filter,
  Search,
  MoreHorizontal,
  CalendarDays,
  MessageCircle,
  CheckCircle2,
  Clock3,
  Users,
  Activity as ActivityIcon,
  Settings,
  Mail,
  Shield,
  Trash2,
  SlidersHorizontal,
  Send,
  Command,
  RefreshCcw,
} from "lucide-react";
import {
  WorkspaceShell,
  PageHeader,
  EmptyState,
  ErrorState,
  Skeleton,
} from "./shared";
import { Button, Card, Avatar, Badge, Progress, Input } from "./ui";
import {
  projects,
  tasks,
  members,
  activities,
  notifications,
} from "@/lib/mock-data";
export function Overview() {
  const r = useRouter();
  return (
    <WorkspaceShell>
      <PageHeader
        title="Good morning, Priyanshu."
        description="Here's what's happening across your workspace."
      >
        <Button onClick={() => r.push("/workspace/nexus-studio/projects")}>
          <Plus size={16} />
          New project
        </Button>
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { a: "Active projects", b: "24", I: FolderKanbanIcon },
          { a: "Tasks", b: "128", I: CheckCircle2 },
          { a: "Completed", b: "87%", I: ActivityIcon },
          { a: "Members", b: "12", I: Users },
        ].map(({ a, b, I: Icon }) => (
          <Card key={a} className="p-5">
            <Icon size={17} className="text-nexus" />
            <p className="mt-5 text-xs text-[#888]">{a}</p>
            <p className="mt-1 text-3xl font-bold">{b}</p>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold">Recent projects</h3>
            <button
              onClick={() => r.push("/workspace/nexus-studio/projects")}
              className="text-xs font-semibold text-nexus"
            >
              View all
            </button>
          </div>
          {projects.slice(0, 3).map((p) => (
            <div
              key={p.id}
              onClick={() => r.push(`/workspace/nexus-studio/projects/${p.id}`)}
              className="mb-3 cursor-pointer rounded-2xl border border-black/5 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-1 text-xs text-[#888]">{p.description}</p>
                </div>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: p.color }}
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={p.progress} />
                </div>
                <span className="text-xs font-semibold">{p.progress}%</span>
              </div>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold">Upcoming deadlines</h3>
            <CalendarDays size={17} className="text-[#999]" />
          </div>
          {tasks.slice(0, 5).map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 border-t border-black/5 py-3"
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#6D5DFB]/10 text-nexus">
                <Clock3 size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{t.title}</p>
                <p className="text-[10px] text-[#999]">{t.project}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#777]">
                {t.dueDate}
              </span>
            </div>
          ))}
        </Card>
      </div>
      <div className="mt-5">
        <Card className="p-5">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold">Progress</h3>
            <span className="text-xs text-[#999]">Last 30 days</span>
          </div>
          <div className="flex h-44 items-end gap-2">
            {[34, 45, 42, 61, 55, 72, 67, 80, 76, 88, 82, 94, 90, 96].map(
              (v, i) => (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  key={i}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-[#d9d4ff] to-[#6D5DFB]"
                />
              ),
            )}
          </div>
        </Card>
      </div>
    </WorkspaceShell>
  );
}
function FolderKanbanIcon(p: { size: number }) {
  return (
    <svg
      width={p.size}
      height={p.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M7 12h3M7 15h6" />
    </svg>
  );
}
export function ProjectsPage() {
  const r = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <WorkspaceShell>
      <PageHeader
        title="Projects"
        description="A clear view of everything your team is moving forward."
      >
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? "List" : "Grid"} view
          </Button>
          <Button>
            <Plus size={16} />
            New Project
          </Button>
        </div>
      </PageHeader>
      <div
        className={
          view === "grid"
            ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            : "space-y-3"
        }
      >
        {projects.map((p) => (
          <Card
            key={p.id}
            className="group cursor-pointer p-5 transition hover:-translate-y-1 hover:shadow-glow"
            onClick={() => r.push(`/workspace/nexus-studio/projects/${p.id}`)}
          >
            <div className="flex items-start justify-between">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl text-white"
                style={{ background: p.color }}
              >
                <FolderKanbanIcon size={19} />
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="rounded-lg p-2 text-[#aaa] hover:bg-black/5"
              >
                <MoreHorizontal size={17} />
              </button>
            </div>
            <h3 className="mt-6 font-bold">{p.name}</h3>
            <p className="mt-1 text-xs leading-5 text-[#888]">
              {p.description}
            </p>
            <div className="mt-5 flex items-center justify-between text-[11px] text-[#888]">
              <span>{p.tasks} tasks</span>
              <span>Due {p.due}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={p.progress} />
              <span className="text-xs font-semibold">{p.progress}%</span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex -space-x-2">
                {members.slice(0, Math.min(3, p.members)).map((m) => (
                  <Avatar key={m.id} name={m.name} size="sm" />
                ))}
              </div>
              <span className="text-[10px] text-[#999]">
                {p.members} members
              </span>
            </div>
          </Card>
        ))}
      </div>
    </WorkspaceShell>
  );
}
export function ProjectDetail({ projectId }: { projectId: string }) {
  const r = useRouter();
  const p = projects.find((x) => x.id === projectId) || projects[0];
  return (
    <WorkspaceShell>
      <div className="mb-6 flex items-center gap-2 text-xs text-[#999]">
        Projects <span>/</span> {p.name}
      </div>
      <PageHeader title={p.name} description={p.description}>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Users size={16} />
            {p.members}
          </Button>
          <Button
            onClick={() =>
              r.push(`/workspace/nexus-studio/projects/${p.id}/board`)
            }
          >
            Open board <ArrowUpRight size={16} />
          </Button>
        </div>
      </PageHeader>
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: p.color }}
          />
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Project progress</span>
              <b>{p.progress}%</b>
            </div>
            <div className="mt-3">
              <Progress value={p.progress} />
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.75fr]">
        <Card className="p-5">
          <div className="mb-5 flex gap-2 border-b border-black/5 pb-3">
            {["Overview", "Board", "Tasks", "Activity"].map((x, i) => (
              <button
                key={x}
                onClick={() =>
                  x === "Board" &&
                  r.push(`/workspace/nexus-studio/projects/${p.id}/board`)
                }
                className={
                  "rounded-lg px-3 py-2 text-xs font-semibold " +
                  (i === 0 ? "bg-black/5" : "text-[#888]")
                }
              >
                {x}
              </button>
            ))}
          </div>
          <h3 className="font-bold">Milestones</h3>
          {["Discovery", "Interface system", "Implementation", "Launch"].map(
            (x, i) => (
              <div key={x} className="mt-4 flex items-center gap-3">
                <div
                  className={
                    "h-2.5 w-2.5 rounded-full " +
                    (i < 3 ? "bg-nexus" : "bg-black/10")
                  }
                />
                <div className="flex-1 text-sm">{x}</div>
                <span className="text-xs text-[#999]">
                  {i < 3 ? "Complete" : "Upcoming"}
                </span>
              </div>
            ),
          )}
        </Card>
        <Card className="p-5">
          <h3 className="font-bold">Team</h3>
          <div className="mt-5 space-y-3">
            {members.slice(0, p.members).map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <Avatar name={m.name} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-[10px] text-[#999]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </WorkspaceShell>
  );
}
export function BoardPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const r = useRouter();
  const cols = ["TODO", "IN PROGRESS", "REVIEW", "DONE"];
  return (
    <WorkspaceShell>
      <PageHeader
        title="Website Redesign"
        description="A focused board for moving the next important work forward."
      >
        <div className="flex gap-2">
          <Button variant="secondary">
            <Search size={15} />
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={() => setFilter(filter === "ALL" ? "HIGH" : "ALL")}
          >
            <Filter size={15} />
            {filter === "ALL" ? "Filter" : "High priority"}
          </Button>
          <Button>
            <Plus size={15} />
            Add task
          </Button>
        </div>
      </PageHeader>
      <div className="grid gap-3 overflow-x-auto pb-4 md:grid-cols-4">
        {cols.map((col) => (
          <div
            key={col}
            className="min-w-[270px] rounded-2xl bg-black/[.025] p-2.5"
          >
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-[10px] font-bold tracking-[.18em] text-[#888]">
                {col}
              </span>
              <span className="rounded-full bg-black/5 px-2 py-1 text-[10px]">
                {tasks.filter((t) => t.status === col).length}
              </span>
            </div>
            {tasks
              .filter((t) => t.status === col)
              .filter((t) => filter === "ALL" || t.priority === "HIGH")
              .map((t) => (
                <motion.div
                  layout
                  key={t.id}
                  onClick={() => setOpen(t.id)}
                  className="mb-2 cursor-pointer rounded-2xl border border-black/[.07] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-nexus/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-5">
                      {t.title}
                    </h3>
                    <MoreHorizontal
                      size={16}
                      className="shrink-0 text-[#aaa]"
                    />
                  </div>
                  {t.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-[#888]">
                      {t.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.labels.map((x) => (
                      <Badge key={x}>{x}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.assignee} size="sm" />
                      <span className="text-[10px] text-[#777]">
                        {t.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#999]">
                      <MessageCircle size={12} />
                      {t.comments}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        ))}
      </div>
      {open && (
        <TaskDetail
          taskId={open}
          onClose={() => setOpen(null)}
          onOpen={() => r.push("/workspace/nexus-studio/tasks")}
        />
      )}
    </WorkspaceShell>
  );
}
export function TaskDetail({
  taskId,
  onClose,
  onOpen,
}: {
  taskId: string;
  onClose: () => void;
  onOpen: () => void;
}) {
  const t = tasks.find((x) => x.id === taskId) || tasks[0];
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        className="h-full w-full max-w-xl overflow-y-auto bg-[#f7f7f4] p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <Badge tone="purple">Task detail</Badge>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-black/5">
            ×
          </button>
        </div>
        <h2 className="mt-7 text-3xl font-bold">{t.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#777]">
          {t.description ||
            "Keep the task context visible and make the next step obvious."}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["Status", t.status],
            ["Priority", t.priority],
            ["Assignee", t.assignee],
            ["Due date", t.dueDate],
          ].map((x) => (
            <Card className="p-4" key={x[0]}>
              <p className="text-[10px] uppercase tracking-widest text-[#999]">
                {x[0]}
              </p>
              <p className="mt-2 text-sm font-semibold">{x[1]}</p>
            </Card>
          ))}
        </div>
        <div className="mt-7">
          <h3 className="font-bold">Comments</h3>
          {[
            "Looks good — I tightened the spacing.",
            "Can we review this with the mobile state?",
            "Shipped the latest pass.",
          ].map((x, i) => (
            <div className="mt-4 flex gap-3" key={x}>
              <Avatar name={members[i].name} />
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xs font-semibold">{members[i].name}</p>
                <p className="mt-1 text-xs leading-5 text-[#777]">{x}</p>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-8 w-full" onClick={onOpen}>
          Open in My Tasks
        </Button>
      </motion.div>
    </div>
  );
}
export function TasksPage() {
  const [tab, setTab] = useState("All");
  const filtered =
    tab === "Completed"
      ? tasks.filter((t) => t.status === "DONE")
      : tab === "Today"
        ? tasks.filter((t) => t.dueDate === "Today")
        : tab === "Upcoming"
          ? tasks.filter((t) => t.dueDate !== "Today")
          : tasks;
  return (
    <WorkspaceShell>
      <PageHeader
        title="My Tasks"
        description="Your personal view of what needs attention next."
      >
        <Button>
          <Plus size={16} />
          New task
        </Button>
      </PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Today", "Upcoming", "Completed"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={
              "rounded-full px-4 py-2 text-xs font-semibold " +
              (tab === x ? "bg-[#111] text-white" : "bg-white text-[#777]")
            }
          >
            {x}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_150px_120px_120px_110px] border-b border-black/5 bg-black/[.015] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#999] sm:grid">
          <span>Task</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Due date</span>
          <span>Status</span>
        </div>
        {filtered.map((t) => (
          <div
            key={t.id}
            className="grid gap-2 border-b border-black/5 px-5 py-4 sm:grid-cols-[1fr_150px_120px_120px_110px] sm:items-center"
          >
            <div className="flex items-center gap-3">
              <button className="h-4 w-4 rounded border border-black/15" />
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-[10px] text-[#999] sm:hidden">
                  {t.project} · {t.dueDate}
                </p>
              </div>
            </div>
            <span className="hidden text-xs text-[#777] sm:block">
              {t.project}
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
            <span className="hidden text-xs text-[#777] sm:block">
              {t.dueDate}
            </span>
            <span className="text-[10px] font-semibold text-[#777]">
              {t.status}
            </span>
          </div>
        ))}
      </Card>
    </WorkspaceShell>
  );
}
export function MembersPage() {
  const [invite, setInvite] = useState(false);
  return (
    <WorkspaceShell>
      <PageHeader
        title="Team members"
        description="People who make Nexus Studio move."
      >
        <Button onClick={() => setInvite(true)}>
          <Mail size={16} />
          Invite member
        </Button>
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Members", "12"],
          ["Admins", "2"],
          ["Pending invitations", "3"],
        ].map((x) => (
          <Card className="p-5" key={x[0]}>
            <Users size={17} className="text-nexus" />
            <p className="mt-4 text-xs text-[#888]">{x[0]}</p>
            <p className="mt-1 text-2xl font-bold">{x[1]}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5 overflow-hidden">
        <div className="hidden grid-cols-[1fr_1.2fr_100px_120px_80px] border-b border-black/5 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#999] sm:grid">
          <span>Member</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span />
        </div>
        {members.map((m) => (
          <div
            key={m.id}
            className="grid gap-3 border-b border-black/5 px-5 py-4 sm:grid-cols-[1fr_1.2fr_100px_120px_80px] sm:items-center"
          >
            <div className="flex items-center gap-3">
              <Avatar name={m.name} />
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-[10px] text-[#999] sm:hidden">{m.email}</p>
              </div>
            </div>
            <span className="hidden text-xs text-[#777] sm:block">
              {m.email}
            </span>
            <Badge tone={m.role === "OWNER" ? "purple" : "neutral"}>
              {m.role}
            </Badge>
            <span className="hidden text-xs text-[#777] sm:block">
              Aug {12 + m.id.length}
            </span>
            <button className="text-[#aaa] hover:text-[#111]">
              <MoreHorizontal size={17} />
            </button>
          </div>
        ))}
      </Card>
      {invite && <InviteDialog close={() => setInvite(false)} />}
    </WorkspaceShell>
  );
}
function InviteDialog({ close }: { close: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <Card
        className="w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 />
            </div>
            <h3 className="mt-4 text-xl font-bold">Invitation sent</h3>
            <p className="mt-2 text-sm text-[#777]">
              The mock invitation is ready to be replaced by your API later.
            </p>
            <Button className="mt-6" onClick={close}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold">Invite a member</h3>
            <p className="mt-1 text-sm text-[#777]">
              Add someone to Nexus Studio.
            </p>
            <label className="mt-6 block text-xs font-semibold">
              Email
              <Input className="mt-2" placeholder="teammate@example.com" />
            </label>
            <label className="mt-4 block text-xs font-semibold">
              Role
              <select className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm">
                <option>Member</option>
                <option>Admin</option>
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button onClick={() => setSent(true)}>
                <Send size={15} />
                Send invitation
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
export function ActivityPage() {
  return (
    <WorkspaceShell>
      <PageHeader
        title="Activity"
        description="A living timeline of what changed across your workspace."
      />
      <Card className="p-5">
        <div className="relative ml-3 border-l border-black/10 pl-8">
          {activities.concat(activities).map((a, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              key={i}
              className="relative pb-8"
            >
              <div className="absolute -left-[41px] top-1 grid h-6 w-6 place-items-center rounded-full border-4 border-[#f7f7f4] bg-[#6D5DFB]" />
              <div className="flex gap-3">
                <Avatar name={a[0]} />
                <div>
                  <p className="text-sm">
                    <b>{a[0]}</b> {a[1]} <b>{a[2]}</b>
                  </p>
                  <p className="mt-1 text-xs text-[#999]">
                    {a[3]} · Nexus Studio
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </WorkspaceShell>
  );
}
export function NotificationsPage() {
  const [read, setRead] = useState<string[]>([]);
  return (
    <WorkspaceShell>
      <PageHeader
        title="Notifications"
        description="Stay close to the moments that need your attention."
      >
        <Button
          variant="secondary"
          onClick={() => setRead(notifications.map((x) => x[0]))}
        >
          Mark all as read
        </Button>
      </PageHeader>
      <Card className="p-3">
        {["Today", "Yesterday", "Earlier"].map((group, gi) => (
          <div key={group}>
            <p className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-[#aaa]">
              {group}
            </p>
            {notifications
              .slice(
                gi === 0 ? 0 : gi === 1 ? 2 : 3,
                gi === 0 ? 2 : gi === 1 ? 3 : 4,
              )
              .map((n) => (
                <div
                  key={n[0]}
                  onClick={() => setRead([...read, n[0]])}
                  className={
                    "flex cursor-pointer gap-3 rounded-2xl p-4 transition hover:bg-black/[.025] " +
                    (!read.includes(n[0]) ? "bg-[#6D5DFB]/[.035]" : "")
                  }
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#6D5DFB]/10 text-nexus">
                    <BellIcon />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{n[0]}</p>
                    <p className="mt-1 text-xs text-[#777]">{n[1]}</p>
                    <p className="mt-2 text-[10px] text-[#aaa]">{n[2]}</p>
                  </div>
                  {!read.includes(n[0]) && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-nexus" />
                  )}
                </div>
              ))}
          </div>
        ))}
      </Card>
    </WorkspaceShell>
  );
}
function BellIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
export function SettingsPage({ section = "general" }: { section?: string }) {
  const [saved, setSaved] = useState(false);
  const tabs = [
    ["General", "general"],
    ["Members", "members"],
    ["Preferences", "preferences"],
  ];
  return (
    <WorkspaceShell>
      <PageHeader
        title="Settings"
        description="Shape Nexus Studio around how your team works."
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-2">
          {tabs.map(([x, k]) => (
            <a
              key={k}
              href={`/workspace/nexus-studio/settings/${k}`}
              className={
                "mb-1 block rounded-xl px-3 py-2.5 text-sm font-medium " +
                (section === k
                  ? "bg-[#6D5DFB]/10 text-nexus"
                  : "text-[#666] hover:bg-black/5")
              }
            >
              {x}
            </a>
          ))}
        </Card>
        <Card className="p-6 sm:p-8">
          {section === "general" && (
            <General saved={saved} setSaved={setSaved} />
          )}{" "}
          {section === "members" && <MemberSettings />}
          {section === "preferences" && <PreferenceSettings />}
        </Card>
      </div>
    </WorkspaceShell>
  );
}
function General({
  saved,
  setSaved,
}: {
  saved: boolean;
  setSaved: (x: boolean) => void;
}) {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold">General</h2>
        <p className="mt-1 text-sm text-[#777]">Basic workspace information.</p>
      </div>
      <div className="mt-8 space-y-5">
        <label className="block text-xs font-semibold">
          Workspace name
          <Input className="mt-2" defaultValue="Nexus Studio" />
        </label>
        <label className="block text-xs font-semibold">
          Workspace slug
          <Input className="mt-2" defaultValue="nexus-studio" />
        </label>
        <label className="block text-xs font-semibold">
          Description
          <textarea
            className="mt-2 min-h-28 w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-nexus/40"
            defaultValue="Product, design and engineering working together."
          />
        </label>
        <div className="flex justify-end">
          <Button onClick={() => setSaved(true)}>
            {saved ? "Changes saved" : "Save changes"}
          </Button>
        </div>
      </div>
      <div className="mt-12 border-t border-black/5 pt-8">
        <h3 className="font-bold text-red-600">Danger zone</h3>
        <p className="mt-1 text-xs text-[#777]">
          Deleting a workspace is permanent.
        </p>
        <Button variant="danger" className="mt-4">
          <Trash2 size={15} />
          Delete workspace
        </Button>
      </div>
    </>
  );
}
function MemberSettings() {
  return (
    <>
      <h2 className="text-xl font-bold">Member settings</h2>
      <p className="mt-1 text-sm text-[#777]">
        Roles, permissions and invitations.
      </p>
      <div className="mt-8 space-y-4">
        {[
          "Owner can manage workspace",
          "Admins can invite members",
          "Members can create projects",
          "Guests can comment",
        ].map((x, i) => (
          <div
            className="flex items-center justify-between rounded-2xl border p-4"
            key={x}
          >
            <div className="flex items-center gap-3">
              <Shield size={17} className="text-nexus" />
              <span className="text-sm font-medium">{x}</span>
            </div>
            <input
              type="checkbox"
              defaultChecked={i < 3}
              className="rounded border-black/20 text-nexus focus:ring-nexus"
            />
          </div>
        ))}
      </div>
    </>
  );
}
function PreferenceSettings() {
  return (
    <>
      <h2 className="text-xl font-bold">Preferences</h2>
      <p className="mt-1 text-sm text-[#777]">Tune the workspace experience.</p>
      <div className="mt-8 space-y-6">
        <SettingRow title="Theme" text="Choose how Nexus looks.">
          <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
            <option>System</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </SettingRow>
        <SettingRow title="Density" text="How compact should the UI feel?">
          <div className="flex gap-2">
            <Button variant="secondary">Comfortable</Button>
            <Button variant="ghost">Compact</Button>
          </div>
        </SettingRow>
        <SettingRow
          title="Animation"
          text="Respect reduced motion preferences."
        >
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-black/20 text-nexus focus:ring-nexus"
          />
        </SettingRow>
      </div>
    </>
  );
}
function SettingRow({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-[#888]">{text}</p>
      </div>
      {children}
    </div>
  );
}
export function LoadingPage() {
  return (
    <WorkspaceShell>
      <PageHeader title="Loading workspace" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card className="p-5" key={i}>
            <Skeleton className="h-10 w-10" />
            <Skeleton className="mt-5 h-5 w-2/3" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </Card>
        ))}
      </div>
    </WorkspaceShell>
  );
}
export function SearchPage() {
  const [q, setQ] = useState("");
  const all = [
    ...tasks.map((t) => ({ type: "Task", title: t.title, meta: t.project })),
    ...projects.map((p) => ({
      type: "Project",
      title: p.name,
      meta: p.description,
    })),
    ...members.map((m) => ({ type: "Member", title: m.name, meta: m.email })),
  ];
  const found = all.filter(
    (x) =>
      x.title.toLowerCase().includes(q.toLowerCase()) ||
      x.meta.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <WorkspaceShell>
      <PageHeader
        title="Search Nexus"
        description="Search projects, tasks and people across your workspace."
      />
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]"
            size={19}
          />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-12 py-4"
            placeholder="Search Nexus..."
          />
        </div>
        <Card className="mt-4 p-2">
          {q ? (
            found.map((x, i) => (
              <div
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-black/[.025]"
                key={i}
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#6D5DFB]/10 text-nexus">
                  <Command size={15} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{x.title}</p>
                  <p className="text-[10px] text-[#999]">
                    {x.type} · {x.meta}
                  </p>
                </div>
                <ArrowUpRight size={15} className="text-[#aaa]" />
              </div>
            ))
          ) : (
            <EmptyState
              title="Search across Nexus"
              description="Start typing to find tasks, projects, members and activity."
            />
          )}
        </Card>
      </div>
    </WorkspaceShell>
  );
}
