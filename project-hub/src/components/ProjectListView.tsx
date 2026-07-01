import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/projects/Avatar";
import { BranchSource } from "@/components/projects/BranchSource";
import { PinStar } from "@/components/projects/PinStar";
import { ProductChip } from "@/components/projects/ProductChip";
import { StatusChip } from "@/components/projects/StatusChip";
import {
  initialsFor,
  phaseFor,
  productFor,
  relativeTime,
} from "@/components/projects/util";
import type { Identity, ProjectSummary } from "@/lib/api";

interface Props {
  projects: ProjectSummary[];
  onTogglePin: (slug: string) => void;
  fallbackCreator: Identity | null;
}

const COLS =
  "grid grid-cols-[32px_minmax(220px,1fr)_220px_160px_110px_90px] items-center gap-3.5";

export default function ProjectListView({
  projects,
  onTogglePin,
  fallbackCreator,
}: Props) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-base font-medium">No projects yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div
        className={`${COLS} bg-muted/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground`}
      >
        <span />
        <span>Project</span>
        <span>Source · Branch</span>
        <span>Created by</span>
        <span>Status</span>
        <span>Created</span>
      </div>
      {projects.map((p, idx) => {
        const phase = phaseFor(p);
        const product = productFor(p);
        // Legacy records lack creator; fall back to the machine identity.
        // Until that loads, render neutral placeholders, not wrong data.
        const creator = p.creator ?? fallbackCreator;
        return (
          <div
            key={p.slug}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/p/${p.slug}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/p/${p.slug}`);
              }
            }}
            className={`${COLS} cursor-pointer px-4 py-3.5 transition-colors hover:bg-muted/40 ${
              idx > 0 ? "border-t" : ""
            }`}
          >
            <PinStar pinned={!!p.pinned} onToggle={() => onTogglePin(p.slug)} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{p.name}</div>
              <div className="mt-0.5 flex items-center gap-2">
                <ProductChip product={product} />
                {p.latestVersion && (
                  <span className="text-[11px] text-muted-foreground">
                    {p.latestVersion}
                  </span>
                )}
              </div>
            </div>
            <BranchSource branch={p.branch} />
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar
                initials={creator ? initialsFor(creator.name) : "··"}
                src={creator?.avatarUrl}
              />
              <span className="truncate">{creator ? creator.name : "—"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <StatusChip status={phase} detail={p.phaseDetail} />
              {p.status === "running" && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                  title="Dev server running"
                />
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {relativeTime(p.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
