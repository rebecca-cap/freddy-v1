import { useCallback, useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Copy, GitBranch, GitCommit, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type GitInfo, type VariantInfo } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";
import { relativeTime } from "./util";

interface Props {
  slug: string;
  branch: string;
}

const selectClass =
  "h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const MAINLINE = "__mainline__";

export default function BranchPanel({ slug, branch }: Props) {
  const [info, setInfo] = useState<GitInfo | null>(null);
  const [variants, setVariants] = useState<VariantInfo[]>([]);
  const [selected, setSelected] = useState<string>(MAINLINE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commitQuery, setCommitQuery] = useState("");

  // Live "Pull from project" state (variation view only).
  const [pullBusy, setPullBusy] = useState(false);
  const [pullError, setPullError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<string[] | null>(null);
  const [merged, setMerged] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [git, vars] = await Promise.all([
        api.getGitInfo(slug),
        api.listVariants(slug),
      ]);
      setInfo(git);
      setVariants(vars);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const activeVariant =
    selected === MAINLINE ? null : variants.find((v) => v.slug === selected) ?? null;

  // The view's git-shaped data: mainline uses getGitInfo; a variation uses its
  // own payload (no per-variant working-tree state available).
  const view: {
    branch: string;
    baseBranch: string;
    ahead: number;
    behind: number;
    recent: GitInfo["recent"];
    workingTreeClean?: boolean;
  } | null = activeVariant
    ? {
        branch: activeVariant.branch,
        baseBranch: branch,
        ahead: activeVariant.ahead,
        behind: activeVariant.behind,
        recent: activeVariant.recent,
      }
    : info
      ? {
          branch,
          baseBranch: info.baseBranch ?? "main",
          ahead: info.ahead,
          behind: info.behind,
          recent: info.recent,
          workingTreeClean: info.workingTreeClean,
        }
      : null;

  // Client-side commit filter on subject, short hash, and author.
  const cq = commitQuery.trim().toLowerCase();
  const filteredCommits = (view?.recent ?? []).filter(
    (c) =>
      cq === "" ||
      c.subject.toLowerCase().includes(cq) ||
      c.shortHash.toLowerCase().includes(cq) ||
      c.author.toLowerCase().includes(cq),
  );

  function clearPullResults() {
    setPullError(null);
    setConflicts(null);
    setMerged(false);
  }

  async function handlePull() {
    if (!activeVariant) return;
    setPullBusy(true);
    clearPullResults();
    try {
      const res = await api.mergeIntoVariant(slug, activeVariant.slug);
      if (res.merged) {
        setMerged(true);
      } else if (res.conflicts && res.conflicts.length > 0) {
        setConflicts(res.conflicts);
      }
      await load();
    } catch (err: any) {
      setPullError(err?.message ?? String(err));
    } finally {
      setPullBusy(false);
    }
  }

  function handleSelect(value: string) {
    setSelected(value);
    clearPullResults();
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              Branch management
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Live state of this project's worktree against{" "}
              <code className="rounded bg-muted px-1 py-px font-mono text-[11px]">
                {view?.baseBranch ?? "main"}
              </code>
              .
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            title="Re-read git state"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Inspect-only branch selector */}
        <select
          className={selectClass}
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value={MAINLINE}>Mainline · {branch}</option>
          {variants.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.label} · {v.name}
            </option>
          ))}
        </select>

        {/* Source → Branch */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">{view?.baseBranch ?? "main"}</span>
          <span className="text-xs text-muted-foreground/70">→</span>
          <code className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
            {view?.branch ?? branch}
            <CopyBranchButton value={view?.branch ?? branch} />
          </code>
          {view && view.workingTreeClean === false && (
            <span className="rounded bg-amber-100 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-amber-800">
              dirty
            </span>
          )}
        </div>

        {/* Ahead / behind */}
        {view && (
          <div className="grid grid-cols-2 gap-3">
            <Stat
              icon={<ArrowUpFromLine className="h-3.5 w-3.5 text-emerald-600" />}
              label={`Ahead of ${view.baseBranch}`}
              value={view.ahead}
            />
            <Stat
              icon={<ArrowDownToLine className="h-3.5 w-3.5 text-amber-600" />}
              label={`Behind ${view.baseBranch}`}
              value={view.behind}
            />
          </div>
        )}

        {/* Recent commits */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent commits
            </h4>
            {view && view.recent.length > 0 && (
              <span className="text-xs text-muted-foreground">
                showing {filteredCommits.length}
                {commitQuery.trim() !== "" && ` of ${view.recent.length}`}
              </span>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {loading && !info && (
            <div className="text-xs text-muted-foreground">Loading…</div>
          )}

          {view && view.recent.length === 0 && (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              No commits on this branch yet.
            </div>
          )}

          {view && view.recent.length > 0 && (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={commitQuery}
                onChange={(e) => setCommitQuery(e.target.value)}
                placeholder="Search commits by message, hash, or author…"
                className="w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          {view && view.recent.length > 0 && filteredCommits.length === 0 && (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              No commits match “{commitQuery}”
            </div>
          )}

          {view && filteredCommits.length > 0 && (
            <ul className="divide-y rounded-md border bg-card">
              {filteredCommits.map((c) => (
                <li
                  key={c.hash}
                  className="flex items-start gap-3 px-3 py-2.5 text-sm"
                >
                  <GitCommit className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="truncate font-medium">{c.subject}</span>
                      {c.hash === view.recent[0]?.hash && (
                        <span className="rounded bg-primary/10 px-1.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                          HEAD
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <code className="font-mono">{c.shortHash}</code>
                      <span>·</span>
                      <span>{c.author}</span>
                      <span>·</span>
                      <span>{relativeTime(c.authoredAt)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pull result panels (variation view) */}
        {activeVariant && pullError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {pullError}
          </div>
        )}
        {activeVariant && conflicts && conflicts.length > 0 && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
            <p className="font-medium">
              Merge conflicts — resolve in the worktree, then refresh:
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {conflicts.map((f) => (
                <li key={f}>
                  <code className="font-mono">{f}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeVariant && merged && (
          <p className="text-xs text-emerald-600">Merged from project.</p>
        )}

        {/* Actions */}
        <div className="grid gap-2 sm:grid-cols-2">
          {activeVariant ? (
            <Button
              variant="outline"
              onClick={handlePull}
              disabled={pullBusy}
              className="justify-center"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              {pullBusy ? "Pulling…" : "Pull from project"}
            </Button>
          ) : (
            <DisabledAction
              label="Sync from main"
              hint="Pull latest from main into this branch — coming soon"
            />
          )}
          <DisabledAction
            label="Merge to main"
            hint="Merge branch back to main — coming soon"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function CopyBranchButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const { copy } = useToast();
  return (
    <button
      type="button"
      title={copied ? "Copied!" : "Copy branch name"}
      onClick={(e) => {
        e.preventDefault();
        copy(value, "Copied branch name");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-muted-foreground/70 hover:text-foreground"
    >
      <Copy className="h-3 w-3" />
    </button>
  );
}

function DisabledAction({ label, hint }: { label: string; hint: string }) {
  return (
    <span
      title={hint}
      className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md border bg-card/50 px-3 py-2 text-xs font-medium text-muted-foreground/60"
    >
      {label}
    </span>
  );
}
