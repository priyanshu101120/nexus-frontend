import { Skeleton, WorkspaceShell } from "@/components/shared";
import { Card } from "@/components/ui";
export default function Loading() {
  return (
      <WorkspaceShell>
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
