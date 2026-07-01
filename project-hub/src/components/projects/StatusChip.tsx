import { cn } from "@/lib/utils";

export type ProjectPhaseKind =
  | "kickoff"
  | "lofi"
  | "hifi"
  | "handoff"
  | "archived";

const PHASE_CLASS: Record<ProjectPhaseKind, string> = {
  kickoff: "bg-slate-100 text-slate-600",
  lofi: "bg-amber-100 text-amber-800",
  hifi: "bg-blue-100 text-blue-800",
  handoff: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-100 text-slate-400",
};

const PHASE_LABEL: Record<ProjectPhaseKind, string> = {
  kickoff: "Kickoff",
  lofi: "Lo-fi",
  hifi: "Hi-fi",
  handoff: "Handed off",
  archived: "Archived",
};

export function StatusChip({
  status,
  detail,
}: {
  status: ProjectPhaseKind;
  detail?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded px-1.5 py-[3px]",
        "text-[9px] font-bold uppercase tracking-[0.06em]",
        PHASE_CLASS[status],
      )}
    >
      {PHASE_LABEL[status]}
      {detail && (
        <span className="font-medium lowercase opacity-70">{detail}</span>
      )}
    </span>
  );
}
