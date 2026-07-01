import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  Copy,
  ExternalLink,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BranchPanel from "@/components/projects/BranchPanel";
import HifiSection from "@/components/projects/HifiSection";
import ResourcesTab from "@/components/projects/ResourcesTab";
import { PhaseStepper } from "@/components/projects/PhaseStepper";
import { ProductChip } from "@/components/projects/ProductChip";
import {
  StatusChip,
  type ProjectPhaseKind,
} from "@/components/projects/StatusChip";
import { Avatar } from "@/components/projects/Avatar";
import { Tabs, type TabDef } from "@/components/projects/Tabs";
import LofiSection from "@/components/projects/LofiSection";
import DeleteProjectDialog from "@/components/projects/DeleteProjectDialog";
import { initialsFor, phaseFor, productFor } from "@/components/projects/util";
import {
  api,
  type Identity,
  type ProjectDetail as ProjectDetailShape,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast";

type DetailTab = "prototypes" | "branch" | "resources";

interface Props {
  detail: ProjectDetailShape;
  onChange: () => void;
  onDeleted: () => void;
}

export default function ProjectDetail({ detail, onChange, onDeleted }: Props) {
  const { project, rounds, resources, runtime } = detail;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<DetailTab>("prototypes");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const { copy } = useToast();
  const claudeMdPath = `${project.projectPath}/CLAUDE.md`;

  useEffect(() => {
    api
      .getIdentity()
      .then(setIdentity)
      .catch(() => setIdentity(null));
  }, []);

  const phase = phaseFor(project);
  const product = productFor(project);
  // Legacy records lack creator; fall back to the machine identity.
  const creator = project.creator ?? identity;

  async function handleStart() {
    setBusy(true);
    setError(null);
    try {
      await api.startDev(project.slug);
      onChange();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }
  async function handleStop() {
    setBusy(true);
    setError(null);
    try {
      await api.stopDev(project.slug);
      onChange();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }
  // No confirm — archiving is reversible.
  async function handleArchiveToggle() {
    setBusy(true);
    setError(null);
    try {
      await api.setArchived(project.slug, !project.archived);
      onChange();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }
  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await api.deleteProject(project.slug);
      onDeleted();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setBusy(false);
    }
  }

  const tabs: TabDef<DetailTab>[] = [
    { key: "prototypes", label: "Prototypes", count: 0 },
    { key: "branch", label: "Branch" },
    {
      key: "resources",
      label: "Resources",
      count: resources.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Single back affordance — the page isn't deep enough for breadcrumbs */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        ← Back to Project Hub
      </Link>

      {/* Header: identity + runtime actions on one line, quiet meta below.
          Rare actions are demoted to icon buttons. */}
      <header>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <StatusChip status={phase} detail={project.phaseDetail} />
            </div>
            {project.description && (
              <p className="max-w-3xl text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              <ProductChip product={product} />
              <MetaDot />
              <span className="inline-flex items-center gap-1.5">
                <Avatar
                  initials={creator ? initialsFor(creator.name) : "··"}
                  src={creator?.avatarUrl}
                />
                <span>{creator?.name ?? "—"}</span>
              </span>
              <MetaDot />
              <code className="font-mono text-[11px]">{project.branch}</code>
              <MetaDot />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {runtime.running ? (
              <Button onClick={handleStop} disabled={busy} variant="secondary">
                <Square className="h-4 w-4" />
                Stop dev server
              </Button>
            ) : (
              <Button onClick={handleStart} disabled={busy}>
                <Play className="h-4 w-4" />
                Start dev server
              </Button>
            )}
            <Button asChild variant="outline">
              <a
                href={project.devUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.devUrl}`}
              >
                <ExternalLink className="h-4 w-4" />
                {project.devUrl}
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Copy CLAUDE.md path"
              onClick={() => copy(claudeMdPath, "Copied CLAUDE.md path")}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={project.archived ? "Unarchive" : "Archive"}
              onClick={handleArchiveToggle}
              disabled={busy}
            >
              {project.archived ? (
                <ArchiveRestore className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
            <DeleteProjectDialog
              project={project}
              busy={busy}
              onArchive={handleArchiveToggle}
              onConfirmDelete={handleDelete}
            />
          </div>
        </div>

      </header>

      {/* Lifecycle: its own gap-separated tile, distinct from the header
          information above and the tabs below. */}
      <Card className="px-5 py-4">
        <div className="space-y-2">
          <PhaseStepper
            phase={phase}
            archived={project.archived}
            className="w-[70%] min-w-[340px]"
          />
          <p className="text-xs text-muted-foreground">
            {phaseHint(phase, project.phaseDetail)}
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tabs */}
      <Tabs<DetailTab> tabs={tabs} active={tab} onChange={setTab} />

      {tab === "prototypes" && (
        <div className="space-y-5">
          <LofiSection
            slug={project.slug}
            rounds={rounds}
            onChange={onChange}
          />

          <HifiSection
            slug={project.slug}
            devUrl={project.devUrl}
            running={runtime.running}
            projectBranch={project.branch}
          />
        </div>
      )}

      {tab === "branch" && (
        <div className="space-y-5">
          <BranchPanel slug={project.slug} branch={project.branch} />
        </div>
      )}

      {tab === "resources" && (
        <div className="space-y-5">
          <ResourcesTab
            slug={project.slug}
            resources={resources}
            kickoffPath={project.kickoffPath}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

// Next-step guidance per derived phase. Lo-fi narrows on phaseDetail suffix
// ("R2 drafted" / "R2 built" / "R2 in review"); tolerate it being absent.
function phaseHint(phase: ProjectPhaseKind, phaseDetail?: string): string {
  switch (phase) {
    case "kickoff":
      return "Fill the kickoff and create Round 1 to start lo-fi.";
    case "lofi":
      if (phaseDetail?.endsWith("built"))
        return "Wireframes built — run /wireframe-index to generate the round guide.";
      if (phaseDetail?.endsWith("in review"))
        return "Guide generated — review with the PM, then spin the next round or move to hi-fi.";
      // "drafted" — also the fallback when detail is missing.
      return "Round scaffolded — send it to Claude to build wireframes.";
    case "hifi":
      return "Hi-fi in progress — stamp versions as you go; generate a handoff doc when ready.";
    case "handoff":
      return "Handed off — engineering has the spec.";
    case "archived":
      return "Archived — unarchive to resume.";
  }
}

function MetaDot() {
  return <span className="text-muted-foreground/40">·</span>;
}
