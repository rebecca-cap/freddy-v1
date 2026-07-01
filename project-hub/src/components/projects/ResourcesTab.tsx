import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Flag, FolderOpen, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  api,
  lofiFileUrl,
  resourceFileUrl,
  type ExternalResource,
  type ResourceFile,
  type ResourceType,
} from "@/lib/api";
import { cn, formatBytes, formatDate } from "@/lib/utils";
import AddResourceModal from "./AddResourceModal";

type RailKey = "all" | ResourceType | "links";

const RAIL: { key: RailKey; icon: string; label: string }[] = [
  { key: "all", icon: "", label: "All" },
  { key: "docs", icon: "📄", label: "Docs" },
  { key: "interviews", icon: "📝", label: "Interviews" },
  { key: "competitive", icon: "🧭", label: "Competitive" },
  { key: "screenshots", icon: "📷", label: "Screenshots" },
  { key: "links", icon: "🔗", label: "Links" },
];

const TYPE_ICON: Record<string, string> = {
  docs: "📄",
  interviews: "📝",
  competitive: "🧭",
  screenshots: "📷",
  links: "🔗",
};

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i;

// Unified row model spanning both tracks (files on disk + external URLs).
interface Row {
  id: string;
  name: string;
  category: ResourceType | "links";
  meta: string[];
  isImage: boolean;
  imageUrl?: string;
  openHref: string;
  openExternal: boolean; // target=_blank ↗ vs file://
  icon: string;
  onDelete?: () => void;
}

interface Props {
  slug: string;
  resources: ResourceFile[];
  /** Project-level KICKOFF.md — the PRD/brief that seeds lo-fi round 1. */
  kickoffPath?: string;
  onChange: () => void;
}

export default function ResourcesTab({
  slug,
  resources,
  kickoffPath,
  onChange,
}: Props) {
  const [links, setLinks] = useState<ExternalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<RailKey>("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    try {
      const next = await api.listExternalResources(slug);
      setLinks(next.filter((l) => l.category === "links"));
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  async function handleDeleteLink(id: string) {
    const prev = links;
    setLinks((cur) => cur.filter((l) => l.id !== id)); // optimistic
    try {
      await api.deleteExternalResource(slug, id);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLinks(prev); // rollback
    }
  }

  async function handleReveal() {
    setError(null);
    try {
      await api.revealResources(slug);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  }

  // Build the unified row list from scanned files + external links.
  const rows: Row[] = useMemo(() => {
    const fileRows: Row[] = resources.map((f) => {
      const rel = `${f.sub}${f.name}`;
      const isImage = IMAGE_EXT.test(f.name);
      return {
        id: `file:${rel}`,
        name: f.name,
        category: f.type,
        meta: [
          formatBytes(f.size),
          formatDate(f.mtime),
          f.sub || "",
        ].filter(Boolean),
        isImage,
        imageUrl: isImage ? resourceFileUrl(slug, rel) : undefined,
        // file:// links are blocked from an http page — serve over HTTP.
        openHref: resourceFileUrl(slug, rel),
        openExternal: false,
        icon: TYPE_ICON[f.type] ?? "📄",
      };
    });

    const linkRows: Row[] = links.map((l) => {
      const isVideo = /loom\.com|youtube\.com|youtu\.be|vimeo\.com/i.test(l.url);
      return {
        id: `link:${l.id}`,
        name: l.title,
        category: "links",
        meta: ["link", formatDate(l.createdAt), l.note ?? l.url].filter(Boolean),
        isImage: false,
        openHref: l.url,
        openExternal: true,
        icon: isVideo ? "🎥" : "🔗",
        onDelete: () => handleDeleteLink(l.id),
      };
    });

    return [...fileRows, ...linkRows];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, links, slug]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.category] = (c[r.category] ?? 0) + 1;
    return c;
  }, [rows]);

  const q = query.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (active === "all" || r.category === active) &&
      (!q || r.name.toLowerCase().includes(q)),
  );

  // The modal opens in the active category's mode (links → URL track).
  const modalDefault: ResourceType | "links" =
    active === "all" ? "docs" : (active as ResourceType | "links");

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">
            Resources{" "}
            <span className="font-mono text-sm font-normal text-muted-foreground">
              · resources/
            </span>
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Briefs, transcripts, competitive refs, screenshots, links — gathered
            from files on disk, organized by type.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add resource
          </Button>
          <Button size="sm" variant="outline" onClick={handleReveal}>
            <FolderOpen className="h-3.5 w-3.5" />
            Reveal in Finder
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Project brief — pinned. The kickoff is project-level reference
            material (the PRD that seeds lo-fi round 1), not a lo-fi artifact. */}
        {kickoffPath && (
          <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-4 py-2.5 text-sm">
            <Flag className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold">Project brief</span>
              <span className="text-muted-foreground">
                {" "}
                — the kickoff PRD that seeds lo-fi round 1.
              </span>
              <div className="font-mono text-[11px] text-muted-foreground">
                design-system/lofi/KICKOFF.md
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-7 shrink-0">
              <a
                href={lofiFileUrl(slug, "KICKOFF.md")}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open brief
              </a>
            </Button>
          </div>
        )}

        {/* Intake header — client-side search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources by name…"
            className="w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Category rail */}
        <div className="flex flex-wrap gap-1.5">
          {RAIL.map((cat) => {
            const isActive = cat.key === active;
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(cat.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "bg-card text-foreground hover:bg-muted",
                )}
              >
                {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                {cat.label}
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 text-[9px] tabular-nums",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {counts[cat.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resource list */}
        {loading && rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No matching resources. Drop files into{" "}
            <code className="text-xs">resources/</code> or click "Add resource".
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {visible.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40"
              >
                {/* Thumbnail */}
                <div className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/50 text-base">
                  {r.isImage && r.imageUrl ? (
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span aria-hidden="true">{r.icon}</span>
                  )}
                </div>

                {/* Main */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  <div className="flex flex-wrap gap-x-2 truncate text-xs text-muted-foreground">
                    {r.meta.map((m, i) => (
                      <span key={i} className={cn(i > 0 && "before:mr-2 before:opacity-50 before:content-['·']")}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {/* TODO(lo-fi slice): per-resource "include in context" toggle + Feeds-lo-fi panel — see resources-tab-feasibility.md build order step 6. */}
                  <a
                    href={r.openHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    {r.openExternal ? (
                      <>
                        Open <ExternalLink className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      "Open"
                    )}
                  </a>
                  {r.onDelete && (
                    <button
                      type="button"
                      title="Delete"
                      onClick={r.onDelete}
                      className="text-muted-foreground/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <AddResourceModal
        slug={slug}
        open={modalOpen}
        defaultType={modalDefault}
        onOpenChange={setModalOpen}
        onAdded={() => {
          // Files come back via onChange (re-fetch project detail);
          // links are reloaded locally.
          onChange();
          void loadLinks();
        }}
      />
    </Card>
  );
}
