import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type VariantInfo, type VersionRecord } from "@/lib/api";
import { cn } from "@/lib/utils";
import { relativeTime } from "./util";
import { Track } from "./timeline/Track";
import NewVariantDialog from "./NewVariantDialog";
import VariantTrack from "./VariantTrack";

interface Props {
  slug: string;
  devUrl: string;
  running: boolean;
  projectBranch?: string;
}

export default function HifiSection({ slug, devUrl, running, projectBranch }: Props) {
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [variants, setVariants] = useState<VariantInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stamping, setStamping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlled NewVariantDialog state (so version chips can preset the fork).
  const [dialog, setDialog] = useState<{ open: boolean; fromVersion?: string }>({
    open: false,
  });

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vers, vars] = await Promise.all([
        api.listVersions(slug),
        api.listVariants(slug),
      ]);
      setVersions(vers);
      setVariants(vars);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const latest = versions[versions.length - 1];
  const nextLabel = `v${versions.length + 1}`;

  async function handleStamp() {
    setStamping(true);
    setError(null);
    try {
      await api.stampVersion(slug);
      await reload();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setStamping(false);
    }
  }

  const mainlineChips = (
    <>
      {versions.map((v, idx) => {
        const isLatest = idx === versions.length - 1;
        return (
          <button
            key={v.label}
            type="button"
            onClick={() => setDialog({ open: true, fromVersion: v.label })}
            title={`Stamped ${relativeTime(v.createdAt)}`}
            className={cn(
              "inline-flex h-7 min-w-12 items-center justify-center rounded-md border bg-card px-2 text-[11px] font-bold tabular-nums shadow-sm transition-colors hover:border-primary/50",
              isLatest
                ? "border-primary/40 bg-primary/10 text-primary"
                : "text-muted-foreground/70",
            )}
          >
            {v.label}
          </button>
        );
      })}
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={handleStamp}
        disabled={stamping || loading}
        title={`Stamp current state as ${nextLabel}`}
      >
        <Plus className={cn("h-3.5 w-3.5", stamping && "animate-spin")} />
      </Button>
    </>
  );

  const mainlineTrailing = running ? (
    <Button asChild variant="outline" size="sm" className="ml-auto shrink-0">
      <a
        href={devUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Launch ${devUrl}`}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Launch
      </a>
    </Button>
  ) : (
    <span
      title="Start dev server first"
      className="ml-auto inline-flex shrink-0 cursor-not-allowed items-center gap-1 rounded-md border bg-card/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground/60"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      Launch
    </span>
  );

  // Group variations under their parent version, in version order then label
  // order. Variations with an unknown parentVersion go last.
  const versionOrder = new Map(versions.map((v, i) => [v.label, i]));
  const groupedVariants = [...variants].sort((a, b) => {
    const ai = versionOrder.get(a.parentVersion) ?? Number.MAX_SAFE_INTEGER;
    const bi = versionOrder.get(b.parentVersion) ?? Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return a.label.localeCompare(b.label);
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Hi-fi{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                · 04-hifi/
              </span>
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Versions are save-points on the mainline — stamp one any time.
              Fork a variation to revisit an old version or build a per-client
              copy.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={reload}
              disabled={loading}
              title="Re-read versions"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <NewVariantDialog
              slug={slug}
              versions={versions}
              open={dialog.open}
              onOpenChange={(open) =>
                setDialog((d) => ({ ...d, open, fromVersion: open ? d.fromVersion : undefined }))
              }
              fromVersion={dialog.fromVersion}
              onCreated={reload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialog({ open: true, fromVersion: latest?.label })}
              disabled={loading || versions.length === 0}
            >
              <Plus className="h-3.5 w-3.5" />
              New variation
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {loading && versions.length === 0 && (
          <div className="text-xs text-muted-foreground">Loading versions…</div>
        )}

        {/* Empty state: no versions means no prototype worktree on disk
            (healthy projects always carry v1 from creation). */}
        {!loading && !error && versions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No hi-fi prototype</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This project has no prototype worktree on disk, so versions and
              variations aren&apos;t available.
            </p>
          </div>
        ) : (
          /* Tracks: mainline + variations */
          <div className="space-y-4">
            <Track label="Mainline" chips={mainlineChips} trailing={mainlineTrailing} />
            {groupedVariants.map((v) => (
              <VariantTrack
                key={v.slug}
                slug={slug}
                variant={v}
                onChanged={reload}
              />
            ))}
            {variants.length === 0 && (
              <p className="pl-44 text-[11px] italic text-muted-foreground/70">
                No variations yet — fork a per-client copy with New variation.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
