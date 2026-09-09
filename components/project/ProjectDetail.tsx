"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowUpRight, Users } from "lucide-react";
import { Button, Card, Avatar, Progress } from "@/components/ui";
import { useProjectContext } from "@/context/ProjectContext";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { project, taskCounts, progressPercent } = useProjectContext();
  const { members } = useWorkspaceContext();

  if (!project) return null; // layout's ProjectGate already handles loading/error

  const goToBoard = () => router.push(`/workspace/${slug}/projects/${project.id}/board`);

  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-xs text-[#999]">
        <button onClick={() => router.push(`/workspace/${slug}/projects`)} className="hover:text-black">
          Projects
        </button>
        <span>/</span> {project.name}
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-black/50">{project.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary">
            <Users size={16} />
            {members.length}
          </Button>
          <Button onClick={goToBoard}>
            Open board <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: project.color || "#6d5dfb" }}
          />
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Project progress</span>
              <b>{progressPercent}%</b>
            </div>
            <div className="mt-3">
              <Progress value={progressPercent} />
            </div>
            <p className="mt-1 text-xs text-black/40">
              {taskCounts.done} of {taskCounts.total} tasks done
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.75fr]">
        <Card className="p-5">
          <div className="mb-5 flex gap-2 border-b border-black/5 pb-3">
            {["Overview", "Board", "Tasks", "Activity"].map((x, i) => (
              <button
                key={x}
                onClick={() => x === "Board" && goToBoard()}
                className={
                  "rounded-lg px-3 py-2 text-xs font-semibold " +
                  (i === 0 ? "bg-black/5" : "text-[#888]")
                }
              >
                {x}
              </button>
            ))}
          </div>

          <h3 className="font-bold">Board columns</h3>
          {(project.board?.columns ?? []).map((col) => (
            <div key={col.id} className="mt-4 flex items-center gap-3">
              <div
                className={
                  "h-2.5 w-2.5 rounded-full " +
                  (col.name.trim().toUpperCase() === "DONE" ? "bg-nexus" : "bg-black/10")
                }
              />
              <div className="flex-1 text-sm">{col.name}</div>
              <span className="text-xs text-[#999]">{col.tasks.length} tasks</span>
            </div>
          ))}
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">Team</h3>
          <div className="mt-5 space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <Avatar name={m.user.name} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.user.name}</p>
                  <p className="text-[10px] text-[#999]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}