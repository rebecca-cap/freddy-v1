import { GitMerge, Plus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Track } from "./timeline/Track";

interface Props {
  title: string;
  subtitle: string;
  pathHint: string;
  versions: { label: string; active?: boolean }[];
  branchVersions?: { label: string; head?: boolean }[];
  branchLabel?: string;
  showMerge?: boolean;
}

export function TimelinePlaceholder({
  title,
  subtitle,
  pathHint,
  versions,
  branchVersions,
  branchLabel,
  showMerge,
}: Props) {
  return (
    <Card className="opacity-75">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              {title}{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                · {pathHint}
              </span>
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <DisabledChip label="📓 changelog" />
            <DisabledChip label="↗ Launch" />
            <DisabledChip label={<><Send className="h-3 w-3" /> Send to Claude</>} />
            {showMerge && <DisabledChip label={<><GitMerge className="h-3 w-3" /> Merge to Main</>} />}
            <DisabledChip label={<><Plus className="h-3 w-3" /> New version</>} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Track label="Mainline" chips={<VersionChips versions={versions} />} trailing={<AddChip />} />
        {branchVersions && (
          <Track
            label={branchLabel ?? "Branch"}
            chips={
              <VersionChips
                versions={branchVersions.map((v) => ({
                  label: v.label,
                  active: v.head,
                }))}
              />
            }
            trailing={<AddChip />}
            dashed
            offset
          />
        )}
        <p className="text-center text-[11px] italic text-muted-foreground/70">
          Timeline view is a placeholder — coming soon.
        </p>
      </CardContent>
    </Card>
  );
}

function VersionChips({
  versions,
}: {
  versions: { label: string; active?: boolean }[];
}) {
  return (
    <>
      {versions.map((v) => (
        <span
          key={v.label}
          className={cn(
            "inline-flex h-7 w-12 items-center justify-center rounded-md border bg-card text-[11px] font-bold tabular-nums shadow-sm",
            v.active
              ? "border-primary/40 bg-primary/10 text-primary"
              : "text-muted-foreground/70",
          )}
        >
          {v.label}
        </span>
      ))}
    </>
  );
}

function AddChip() {
  return (
    <span
      title="Add version — coming soon"
      className="inline-flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-md border border-dashed bg-card/50 text-muted-foreground/50"
    >
      <Plus className="h-3.5 w-3.5" />
    </span>
  );
}

function DisabledChip({ label }: { label: React.ReactNode }) {
  return (
    <span
      title="Coming soon"
      className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border bg-card/50 px-2 py-1 text-[11px] font-medium text-muted-foreground/60"
    >
      {label}
    </span>
  );
}
