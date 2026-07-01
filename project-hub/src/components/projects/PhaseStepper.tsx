import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { ProjectPhaseKind } from "./StatusChip";

const STEPS = [
  { key: "kickoff", label: "Kickoff" },
  { key: "lofi", label: "Lo-fi" },
  { key: "hifi", label: "Hi-fi" },
  { key: "handoff", label: "Handoff" },
] as const;

const STEP_INDEX: Partial<Record<ProjectPhaseKind, number>> = {
  kickoff: 0,
  lofi: 1,
  hifi: 2,
  handoff: 3,
};

// Single-row lifecycle stepper. Dumb on purpose — phase is derived
// server-side; archived renders the whole row muted with no current step.
// Connectors flex-grow so the steps spread across the available width; pass a
// width via className (e.g. w-[70%]) to control how far it stretches.
export function PhaseStepper({
  phase,
  archived,
  className,
}: {
  phase: ProjectPhaseKind;
  archived?: boolean;
  className?: string;
}) {
  const muted = archived || phase === "archived";
  const current = muted ? -1 : (STEP_INDEX[phase] ?? 0);

  return (
    <div
      className={cn("flex w-full items-center gap-2 text-sm", className)}
      aria-label="Project lifecycle phase"
    >
      {STEPS.map((step, i) => {
        const done = !muted && i < current;
        const active = !muted && i === current;
        return (
          <Fragment key={step.key}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 shrink min-w-[24px]",
                  done || active ? "bg-primary/60" : "bg-border",
                )}
              />
            )}
            <span className="inline-flex shrink-0 items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "h-3 w-3 rounded-full",
                  muted && "bg-muted-foreground/20",
                  done && "bg-primary",
                  active && "bg-primary ring-2 ring-primary/30",
                  !muted && !done && !active && "bg-muted-foreground/20",
                )}
              />
              <span
                className={cn(
                  muted
                    ? "text-muted-foreground/60"
                    : active
                      ? "font-semibold text-foreground"
                      : done
                        ? "text-foreground/80"
                        : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </span>
          </Fragment>
        );
      })}
      {muted && (
        <span className="ml-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Archived
        </span>
      )}
    </div>
  );
}
