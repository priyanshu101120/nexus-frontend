"use client";
import { ReactNode, useEffect, useState } from "react";
import {
  Command,
  Search,
  X,
  Bell,
  Settings,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  Menu,
} from "lucide-react";
import { Avatar, Button, Card } from "./ui";
import { usePathname, useRouter } from "next/navigation";
export function ThemeToggle() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("nexus-theme") === "dark";
    setD(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);
  return (
    <Button
      variant="ghost"
      onClick={() => {
        const v = !d;
        setD(v);
        document.documentElement.classList.toggle("dark", v);
        localStorage.setItem("nexus-theme", v ? "dark" : "light");
      }}
    >
      {d ? "☀" : "◐"}
    </Button>
  );
}
export function CommandMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const r = useRouter();
  if (!open) return null;
  const items = [
    ["Overview", "/workspace/nexus-studio/overview", FolderKanban],
    ["Projects", "/workspace/nexus-studio/projects", FolderKanban],
    ["Tasks", "/workspace/nexus-studio/tasks", CheckSquare],
    ["Members", "/workspace/nexus-studio/members", Users],
    ["Activity", "/workspace/nexus-studio/activity", Activity],
    ["Settings", "/workspace/nexus-studio/settings/general", Settings],
  ] as const;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/35 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="mx-auto mt-[12vh] max-w-xl overflow-hidden bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-black/10 p-4">
          <Search size={18} className="text-[#999]" />
          <input
            autoFocus
            placeholder="Search Nexus..."
            className="flex-1 border-0 bg-transparent outline-none"
          />
          <kbd className="rounded-md bg-black/5 px-2 py-1 text-xs">ESC</kbd>
        </div>
        <div className="p-2">
          {items.map(([name, href, Icon]) => (
            <button
              key={name}
              onClick={() => {
                r.push(href);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-[#f4f3ff]"
            >
              <Icon size={17} />
              {name}
              <span className="ml-auto text-xs text-[#aaa]">↵</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
export function PageHeader({
  title,
  description,
  children,
  slug,
  routerLink,
}: {
  title: string;
  slug: string;
  routerLink: string;
  description?: string;
  children?: ReactNode; 
}) {
  const router=useRouter()
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-nexus">
          Nexus workspace
        </p>
        <h1 onClick={() => router.push(routerLink)} className="text-3xl font-bold tracking-tight cursor-pointer hover:text-nexus sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-[#737373]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="grid min-h-[360px] place-items-center p-8 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#6D5DFB]/10 text-nexus">
          <Command size={28} />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#777]">
          {description}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </Card>
  );
}
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={"animate-pulse rounded-xl bg-black/5 " + className} />;
}
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this view.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50" />
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[#777]">{description}</p>
      <Button className="mt-5" onClick={() => location.reload()}>
        Try again
      </Button>
    </Card>
  );
}
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const r = useRouter();
  const [cmd, setCmd] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmd(true);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  const links = [
    ["Overview", "overview", FolderKanban],
    ["Projects", "projects", FolderKanban],
    ["My Tasks", "tasks", CheckSquare],
    ["Members", "members", Users],
    ["Activity", "activity", Activity],
  ] as const;
  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#111] dark:bg-[#0d0d10] dark:text-white">
      <CommandMenu open={cmd} onClose={() => setCmd(false)} />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/[.06] bg-[#f7f7f4]/85 backdrop-blur-xl dark:border-white/[.07] dark:bg-[#0d0d10]/85">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobile(true)}>
              <Menu />
            </button>
            <button
              onClick={() => r.push("/")}
              className="text-lg font-black tracking-[-.05em]"
            >
              NEXUS<span className="text-nexus">.</span>
            </button>
            <div className="hidden h-7 w-px bg-black/10 lg:block" />
            <button
              onClick={() => r.push("/workspace")}
              className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-black/5 sm:flex"
            >
              Nexus Studio <span className="text-[#aaa]">⌄</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCmd(true)}
              className="hidden items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-xs text-[#777] sm:flex"
            >
              <Search size={15} />
              Search <kbd>⌘K</kbd>
            </button>
            <Button
              variant="ghost"
              onClick={() => setCmd(true)}
              className="sm:hidden"
            >
              <Search size={18} />
            </Button>
            <Button variant="ghost">
              <Bell size={18} />
            </Button>
            <ThemeToggle />
            <Avatar name="Priyanshu" size="sm" />
          </div>
        </div>
      </header>
     
      {mobile && (
        <div
          className="fixed inset-0 z-50 bg-black/30 lg:hidden"
          onClick={() => setMobile(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[290px] bg-[#f7f7f4] p-5 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <b className="text-lg">
                NEXUS<span className="text-nexus">.</span>
              </b>
              <button onClick={() => setMobile(false)}>
                <X />
              </button>
            </div>
            {links.map(([label, key, Icon]) => (
              <button
                key={key}
                onClick={() => {
                  r.push(`/workspace/nexus-studio/${key}`);
                  setMobile(false);
                }}
                className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm"
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                r.push("/workspace/nexus-studio/notifications");
                setMobile(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm"
            >
              <Bell size={18} />
              Notifications
            </button>
            <button
              onClick={() => {
                r.push("/workspace/nexus-studio/settings/general");
                setMobile(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm"
            >
              <Settings size={18} />
              Settings
            </button>
          </aside>
        </div>
      )}
      <main >{children}</main>
    </div>
  );
}
