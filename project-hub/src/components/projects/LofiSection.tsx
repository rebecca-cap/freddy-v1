import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Flag,
  GitBranch,
  Image as ImageIcon,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  api,
  lofiFileUrl,
  type LofiOption,
  type LofiRound,
  type LofiStatus,
} from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast";

interface Props {
  slug: string;
  rounds: LofiRound[];
  /** Re-fetch project detail (rounds) after a mutation. */
  onChange: () => void;
}

/**
 * Vendored WireframeDesignSystem that rounds/options build against. Referenced
 * by absolute path in each round/option CLAUDE.md (server-side) and surfaced in
 * the Send-to-Claude prompt here so the build instruction is self-contained.
 */
const WIREFRAME_DESIGN_SYSTEM_PATH =
  "/Users/frankoverland/freddy/project-hub/resources/wireframe-design-system";

// ---------------------------------------------------------------------------
// Status presentation (mirrors the wireframe's badge palette via app tokens).
// ---------------------------------------------------------------------------
const STATUS_META: Record<
  LofiStatus,
  { label: string; dot: string; badge: string }
> = {
  drafted: {
    label: "Drafted",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
  },
  built: {
    label: "Built",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  documented: {
    label: "Documented",
    dot: "bg-primary",
    badge: "border-primary/30 bg-primary/10 text-primary",
  },
};

function StatusBadge({ status }: { status: LofiStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        m.badge,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

function basename(p: string): string {
  return p.split("/").filter(Boolean).pop() ?? p;
}

export default function LofiSection({ slug, rounds, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<"none" | "handoff">("none");
  const { show: showToast } = useToast();

  // Active work first: in-tree rounds newest-first, then imported externals
  // (they're history, not the working set).
  const inTree = useMemo(
    () => rounds.filter((r) => !r.external).sort((a, b) => b.round - a.round),
    [rounds],
  );
  const externals = useMemo(() => rounds.filter((r) => r.external), [rounds]);

  async function handleNewRound() {
    setBusy(true);
    setError(null);
    try {
      const created = await api.createLofi(slug);
      onChange();
      showToast(
        `Created ${created.name}/ → scaffolded CLAUDE.md, brief.md, context/, wireframes/`,
      );
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleBranchOption(round: LofiRound) {
    const name = window.prompt(
      `Name the branch-option off ${round.name} (e.g. "two-pane", "stacked"):`,
    );
    if (!name || !name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const opt = await api.createBranchOption(slug, round.round, name.trim());
      onChange();
      showToast(`Created branch-option ${round.name}/options/${opt.slug}/`);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Lo-fi{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                · design-system/lofi/
              </span>
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Static HTML wireframe rounds. Sequential rounds, parallel
              branch-options — built against the shared WireframeDesignSystem.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onChange}
              disabled={busy}
              title="Re-read rounds"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewRound}
              disabled={busy}
              title="Create the next sequential round"
            >
              <Plus className="h-3.5 w-3.5" />
              New round
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Rounds — vertical, expandable, every action inline */}
        {rounds.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            No rounds yet. <b>New round</b> scaffolds round-1 (CLAUDE.md, brief,
            wireframes/) — seeded by the project brief in Resources.
          </p>
        ) : (
          <ul className="divide-y rounded-md border bg-card">
            {inTree.map((r) => (
              <RoundRow
                key={r.name}
                slug={slug}
                round={r}
                busy={busy}
                onSend={showToast}
                onBranch={() => handleBranchOption(r)}
              />
            ))}
            {externals.map((r) => (
              <RoundRow
                key={r.name}
                slug={slug}
                round={r}
                busy={busy}
                onSend={showToast}
              />
            ))}
          </ul>
        )}

        {/* Promote to hi-fi (informational only) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="max-w-xl text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              Ready for hi-fi?
            </span>{" "}
            Promoting would wire the chosen round into a hi-fi project's
            CLAUDE.md and generate a handoff doc.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPanel((p) => (p === "handoff" ? "none" : "handoff"))}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Promote to hi-fi
          </Button>
        </div>

        {panel === "handoff" && (
          <div className="rounded-md border bg-card">
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <ArrowRight className="h-3.5 w-3.5" />
                What would get wired into hi-fi
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPanel("none")}
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="space-y-3 p-4">
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                This is a preview — actual promotion is wired in a later handoff
                pass. Nothing is written yet.
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <HandoffItem
                  icon={<ImageIcon className="h-3.5 w-3.5" />}
                  title="Chosen wireframes"
                  detail="round-N/wireframes/ → referenced in hi-fi CLAUDE.md"
                />
                <HandoffItem
                  icon={<Flag className="h-3.5 w-3.5" />}
                  title="Kickoff + decisions"
                  detail="KICKOFF.md · WIREFRAME-GUIDE.html"
                />
                <HandoffItem
                  icon={<Palette className="h-3.5 w-3.5" />}
                  title="Design system"
                  detail="WireframeDesignSystem + /wireframe-index"
                />
                <HandoffItem
                  icon={<FileText className="h-3.5 w-3.5" />}
                  title="Handoff doc"
                  detail="HANDOFF.md generated via /handoff-doc"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// One round (or external import) as an expandable row. The expander inlines a
// live preview of the round's gallery — in-tree rounds via the lofi/files
// route, externals via their preview route.
// ---------------------------------------------------------------------------
function RoundRow({
  slug,
  round,
  busy,
  onSend,
  onBranch,
}: {
  slug: string;
  round: LofiRound;
  busy: boolean;
  onSend: (msg: string) => void;
  /** Absent for externals — they can't host branch-options. */
  onBranch?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const title = round.external
    ? (round.label ?? round.name)
    : `Round ${round.round}`;
  const launchable = round.external
    ? !!round.previewUrl
    : round.status !== "drafted" && round.wireframeCount > 0;
  const launchHref = round.external
    ? (round.previewUrl ?? "")
    : lofiFileUrl(slug, `${round.name}/index.html`);
  const previewSrc = launchable ? launchHref : null;

  return (
    <li className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => previewSrc && setExpanded((v) => !v)}
          aria-expanded={expanded}
          disabled={!previewSrc}
          title={
            previewSrc
              ? expanded
                ? "Hide preview"
                : "Preview wireframes inline"
              : "Nothing to preview yet"
          }
          className={cn(
            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors",
            previewSrc
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/30",
          )}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{title}</span>
            {round.external && (
              <span className="rounded bg-amber-500/15 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-amber-600">
                External
              </span>
            )}
            <StatusBadge status={round.status} />
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {round.external ? (
              <span className="font-mono">{round.path}</span>
            ) : (
              <>
                {round.wireframeCount} wireframe
                {round.wireframeCount === 1 ? "" : "s"} ·{" "}
                {formatDate(round.createdAt)}
                {round.parentRound > 0 && (
                  <> · iterates on round-{round.parentRound}</>
                )}
              </>
            )}
          </div>
        </div>

        <RoundActions
          slug={slug}
          round={round}
          busy={busy}
          launchable={launchable}
          launchHref={launchHref}
          onSend={onSend}
          onBranch={onBranch}
        />
      </div>

      {/* Drafted rounds teach the next step instead of hiding the gap */}
      {!round.external && round.status === "drafted" && (
        <p className="mt-1.5 pl-9 text-[11px] text-muted-foreground">
          No wireframes yet — <b>Send to Claude</b> builds into{" "}
          <code className="font-mono">{round.name}/wireframes/</code>, then
          Launch and Preview light up.
        </p>
      )}

      {expanded && previewSrc && (
        <div className="mt-3 pl-9">
          <iframe
            title={title}
            src={previewSrc}
            sandbox="allow-same-origin"
            className="h-[480px] w-full rounded-md border bg-white"
          />
        </div>
      )}

      {/* Branch-options nested under their round */}
      {round.options.length > 0 && (
        <ul className="mt-2 space-y-1 pl-9">
          {round.options.map((o) => (
            <OptionRow
              key={o.slug}
              slug={slug}
              round={round}
              option={o}
              onSend={onSend}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Per-row actions. Send-to-Claude copies a self-contained build prompt.
// ---------------------------------------------------------------------------
function RoundActions({
  slug,
  round,
  busy,
  launchable,
  launchHref,
  onSend,
  onBranch,
}: {
  slug: string;
  round: LofiRound;
  busy: boolean;
  launchable: boolean;
  launchHref: string;
  onSend: (msg: string) => void;
  onBranch?: () => void;
}) {
  function handleSend() {
    const lines = [
      `Build the next lo-fi wireframe round into ${round.path}/wireframes/.`,
      "",
      round.parentRound > 0
        ? `Iterate on the previous round (round-${round.parentRound}) — carry its chosen direction forward.`
        : `This is the first round — build from the KICKOFF.md brief.`,
      "",
      `Build against the vendored WireframeDesignSystem at:`,
      `  ${WIREFRAME_DESIGN_SYSTEM_PATH}`,
      "",
      `When done, run /wireframe-index against this round folder to generate WIREFRAME-GUIDE.html (the decisions/changelog layer).`,
      "",
      `Round folder: ${round.path}`,
      `CLAUDE.md:    ${round.claudeMdPath}`,
    ];
    navigator.clipboard?.writeText(lines.join("\n"));
    onSend(
      `Copied prompt → build into ${basename(round.path)}/wireframes/ from WireframeDesignSystem, then run /wireframe-index`,
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
      {!round.external && (
        <Button
          variant="default"
          size="sm"
          onClick={handleSend}
          title="Copy a build prompt for Claude Code"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Send to Claude
        </Button>
      )}

      {launchable ? (
        <Button asChild variant="outline" size="sm" title="Open wireframes">
          <a href={launchHref} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Launch
          </a>
        </Button>
      ) : (
        <span
          title="No wireframes yet — Send to Claude to build them first"
          className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md border bg-card/50 px-3 text-sm font-medium text-muted-foreground/60"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Launch
        </span>
      )}

      {onBranch && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBranch}
          disabled={busy}
          title="Spawn a parallel branch-option off this round"
        >
          <GitBranch className="h-3.5 w-3.5" />
          Branch option
        </Button>
      )}

      {round.guidePath ? (
        <Button asChild variant="ghost" size="sm" title="Open WIREFRAME-GUIDE.html">
          <a
            href={lofiFileUrl(slug, `${round.name}/WIREFRAME-GUIDE.html`)}
            target="_blank"
            rel="noreferrer"
          >
            <BookText className="h-3.5 w-3.5" />
            Decisions / Guide
          </a>
        </Button>
      ) : (
        !round.external && (
          <span
            title="No guide yet — run /wireframe-index after building"
            className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground/50"
          >
            <BookText className="h-3.5 w-3.5" />
            Decisions / Guide
          </span>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A branch-option nested under its round — same affordances, smaller row.
// ---------------------------------------------------------------------------
function OptionRow({
  slug,
  round,
  option,
  onSend,
}: {
  slug: string;
  round: LofiRound;
  option: LofiOption;
  onSend: (msg: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const launchable = option.status !== "drafted" && option.wireframeCount > 0;
  const launchHref = lofiFileUrl(
    slug,
    `${round.name}/options/${option.slug}/index.html`,
  );

  function handleSend() {
    const lines = [
      `Build the next lo-fi wireframe round into ${option.path}/wireframes/.`,
      "",
      `This is a branch-option ("${option.name}") exploring a parallel direction off round ${round.round}.`,
      "",
      `Build against the vendored WireframeDesignSystem at:`,
      `  ${WIREFRAME_DESIGN_SYSTEM_PATH}`,
      "",
      `When done, run /wireframe-index against this round folder to generate WIREFRAME-GUIDE.html (the decisions/changelog layer).`,
      "",
      `Round folder: ${option.path}`,
      `CLAUDE.md:    ${option.claudeMdPath}`,
    ];
    navigator.clipboard?.writeText(lines.join("\n"));
    onSend(
      `Copied prompt → build into options/${option.slug}/wireframes/ from WireframeDesignSystem, then run /wireframe-index`,
    );
  }

  return (
    <li className="rounded-md border border-dashed px-3 py-2">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => launchable && setExpanded((v) => !v)}
          aria-expanded={expanded}
          disabled={!launchable}
          title={launchable ? "Preview wireframes inline" : "Nothing to preview yet"}
          className={cn(
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
            launchable
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "cursor-not-allowed text-muted-foreground/30",
          )}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        <GitBranch className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="text-sm font-medium">{option.name}</span>
        <StatusBadge status={option.status} />
        <span className="text-[11px] text-muted-foreground">
          {option.wireframeCount} wireframe
          {option.wireframeCount === 1 ? "" : "s"}
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={handleSend}
            title="Copy a build prompt for Claude Code"
          >
            <Sparkles className="h-3 w-3" />
            Send to Claude
          </Button>
          {launchable ? (
            <Button asChild variant="ghost" size="sm" className="h-7" title="Open wireframes">
              <a href={launchHref} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3 w-3" />
                Launch
              </a>
            </Button>
          ) : (
            <span
              title="No wireframes yet"
              className="inline-flex h-7 cursor-not-allowed items-center gap-1 rounded-md px-2.5 text-xs font-medium text-muted-foreground/50"
            >
              <ExternalLink className="h-3 w-3" />
              Launch
            </span>
          )}
        </div>
      </div>

      {expanded && launchable && (
        <div className="mt-2.5">
          <iframe
            title={`${round.name} — ${option.name}`}
            src={launchHref}
            sandbox="allow-same-origin"
            className="h-[420px] w-full rounded-md border bg-white"
          />
        </div>
      )}
    </li>
  );
}

function HandoffItem({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border p-3 text-sm">
      <div className="flex items-center gap-1.5 font-semibold">
        {icon}
        {title}
      </div>
      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
        {detail}
      </div>
    </div>
  );
}
