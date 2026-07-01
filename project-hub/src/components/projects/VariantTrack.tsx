import { useState } from "react";
import {
  ArrowUpToLine,
  Check,
  Copy,
  ExternalLink,
  GitMerge,
  Play,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type VariantInfo, type VersionRecord } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";
import { Track } from "./timeline/Track";

interface Props {
  slug: string;
  variant: VariantInfo;
  onChanged: () => void;
}

export default function VariantTrack({ slug, variant, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<string[] | null>(null);
  const [pullMsg, setPullMsg] = useState<string | null>(null);
  const [promoted, setPromoted] = useState<VersionRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [conflictCopied, setConflictCopied] = useState(false);
  const { copy } = useToast();

  function handleCopyClaudeMd() {
    copy(variant.claudeMdPath, "Copied CLAUDE.md path");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleCopyConflictPrompt() {
    if (!conflicts) return;
    const prompt = [
      "I pulled the mainline into this variant's git worktree and hit merge conflicts.",
      "",
      `Worktree: ${variant.prototypePath}`,
      "Conflicting files:",
      ...conflicts.map((f) => `- ${f}`),
      "",
      "Resolve the conflicts in that worktree — keep this variant's seed-data/scenario changes and take the mainline's logic changes where they don't overlap — then commit the merge.",
    ].join("\n");
    copy(prompt, "Copied conflict-resolution prompt");
    setConflictCopied(true);
    window.setTimeout(() => setConflictCopied(false), 1500);
  }

  function clearResults() {
    setError(null);
    setConflicts(null);
    setPullMsg(null);
    setPromoted(null);
  }

  async function handleStart() {
    setBusy(true);
    clearResults();
    try {
      await api.startVariantDev(slug, variant.slug);
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleStop() {
    setBusy(true);
    clearResults();
    try {
      await api.stopVariantDev(slug, variant.slug);
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleMerge() {
    setBusy(true);
    clearResults();
    try {
      const res = await api.mergeIntoVariant(slug, variant.slug);
      if (res.conflicts && res.conflicts.length > 0) {
        setConflicts(res.conflicts);
      } else if (res.merged) {
        const n = res.pulled ?? 0;
        setPullMsg(
          n > 0
            ? `Pulled ${n} commit${n === 1 ? "" : "s"} from project.`
            : "Already up to date.",
        );
      }
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handlePromote() {
    if (
      !confirm(
        `Merge "${variant.name}" into the mainline and stamp the next version?`,
      )
    )
      return;
    setBusy(true);
    clearResults();
    try {
      const res = await api.promoteVariant(slug, variant.slug);
      if (res.merged) {
        setPromoted(res.version ?? null);
      } else if (res.conflicts && res.conflicts.length > 0) {
        setConflicts(res.conflicts);
      }
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete variation "${variant.name}"? This removes the worktree, branch, and folder.`,
      )
    )
      return;
    setBusy(true);
    clearResults();
    try {
      await api.deleteVariant(slug, variant.slug);
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setBusy(false);
    }
  }

  const label = (
    <span className="flex items-center gap-2 truncate">
      <span className="truncate">{variant.name}</span>
    </span>
  );

  const chips = (
    <>
      <span
        title={`Forked from ${variant.parentVersion}`}
        className={cn(
          "inline-flex h-7 items-center justify-center rounded-md border bg-card px-2 text-[11px] font-bold tabular-nums shadow-sm",
          variant.running
            ? "border-primary/40 bg-primary/10 text-primary"
            : "text-muted-foreground/70",
        )}
      >
        {variant.label}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            variant.running ? "bg-emerald-500" : "bg-muted-foreground/30",
          )}
          title={variant.running ? "Running" : "Stopped"}
        />
        <span className="font-mono text-[10px] text-muted-foreground/70">
          :{variant.port}
        </span>
      </span>
      {variant.behind > 0 && (
        <span
          className="inline-flex items-center rounded bg-amber-500/15 px-1.5 py-px text-[10px] font-medium text-amber-600"
          title={`Mainline is ${variant.behind} commit${variant.behind === 1 ? "" : "s"} ahead — pull to catch up`}
        >
          {variant.behind} behind
        </span>
      )}
      {variant.promotedTo && (
        <span className="inline-flex items-center rounded bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">
          promoted → {variant.promotedTo}
        </span>
      )}
    </>
  );

  const trailing = (
    <span className="ml-auto flex items-center gap-1">
      {variant.running ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleStop}
          disabled={busy}
          title="Stop dev server"
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleStart}
          disabled={busy}
          title="Start dev server"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      )}
      {variant.running && (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={`Open ${variant.devUrl}`}
        >
          <a href={variant.devUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleCopyClaudeMd}
        title={
          copied
            ? "Copied!"
            : "Copy CLAUDE.md path — paste into Claude Code to work on this variation only"
        }
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleMerge}
        disabled={busy || variant.behind === 0}
        title={
          variant.behind === 0
            ? "Up to date with project — nothing to pull"
            : `Pull ${variant.behind} commit${variant.behind === 1 ? "" : "s"} from project`
        }
      >
        <GitMerge className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handlePromote}
        disabled={busy}
        title="Promote to mainline"
      >
        <ArrowUpToLine className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleDelete}
        disabled={busy}
        title="Delete variation"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </span>
  );

  return (
    <div className="space-y-2">
      <Track label={label} chips={chips} trailing={trailing} dashed offset />

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {conflicts && conflicts.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          <p className="font-medium">
            Merge conflicts — the pull was aborted, the variant is untouched.
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {conflicts.map((f) => (
              <li key={f}>
                <code className="font-mono">{f}</code>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-2.5 h-7 gap-1.5 text-xs"
            onClick={handleCopyConflictPrompt}
          >
            {conflictCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Claude prompt to resolve
              </>
            )}
          </Button>
        </div>
      )}

      {pullMsg && <p className="text-xs text-emerald-600">{pullMsg}</p>}

      {promoted && (
        <p className="text-xs text-emerald-600">
          Promoted — mainline is now {promoted.label}.
        </p>
      )}
    </div>
  );
}
