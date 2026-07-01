import { Link } from "react-router-dom";
import { Avatar } from "@/components/projects/Avatar";
import { BranchSource } from "@/components/projects/BranchSource";
import { PinStar } from "@/components/projects/PinStar";
import { ProductChip } from "@/components/projects/ProductChip";
import { ProjectCardCover } from "@/components/projects/ProjectCardCover";
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

export default function ProjectList({
  projects,
  onTogglePin,
  fallbackCreator,
}: Props) {
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {projects.map((p) => (
        <ProjectCard
          key={p.slug}
          project={p}
          onTogglePin={onTogglePin}
          fallbackCreator={fallbackCreator}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  onTogglePin,
  fallbackCreator,
}: {
  project: ProjectSummary;
  onTogglePin: (slug: string) => void;
  fallbackCreator: Identity | null;
}) {
  const phase = phaseFor(project);
  const product = productFor(project);
  // Legacy records lack creator; fall back to the machine identity. Until
  // that loads, render neutral placeholders rather than flashing wrong data.
  const creator = project.creator ?? fallbackCreator;
  return (
    <Link to={`/p/${project.slug}`} className="group block">
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md">
        <PinStar
          pinned={!!project.pinned}
          onToggle={() => onTogglePin(project.slug)}
          className="absolute right-2 top-2 z-10 bg-card/80 backdrop-blur-sm"
        />
        <ProjectCardCover slug={project.slug} coverUrl={project.coverUrl} />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold leading-tight">
                {project.name}
              </div>
              <div className="mt-1">
                <ProductChip product={product} />
              </div>
            </div>
            <StatusChip status={phase} detail={project.phaseDetail} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Avatar
                initials={creator ? initialsFor(creator.name) : "··"}
                src={creator?.avatarUrl}
              />
              <span>{creator ? creator.name.split(/\s+/)[0] : "—"}</span>
            </span>
            <BranchSource branch={project.branch} />
            {project.status === "running" && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                title="Dev server running"
              />
            )}
            <span>:{project.port}</span>
            {project.latestVersion && <span>{project.latestVersion}</span>}
            {(project.variantCount ?? 0) > 0 && (
              <span>
                {project.variantCount} variant
                {project.variantCount === 1 ? "" : "s"}
              </span>
            )}
            <span>Created {relativeTime(project.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
