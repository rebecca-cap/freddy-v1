import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXCALIBRR_DEMO_URL,
  fetchDesignRefs,
  type RefEntry,
  type RefKind,
} from "@/lib/designRefs";
import { RefBlockView } from "./RefBlocks";

interface DesignRefBrowserProps {
  kind: RefKind;
  /** Route base, e.g. "/design-system" — entry slugs append to it. */
  basePath: string;
  title: string;
  lead: string;
}

export default function DesignRefBrowser({
  kind,
  basePath,
  title,
  lead,
}: DesignRefBrowserProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<RefEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    fetchDesignRefs(kind)
      .then((r) => {
        if (active) setEntries(r.entries);
      })
      .catch((err) => {
        if (active) setError(err?.message ?? String(err));
      });
    return () => {
      active = false;
    };
  }, [kind]);

  // Deep-linkable selection: no slug in the URL → land on the first entry.
  const active = useMemo(() => {
    if (!entries || entries.length === 0) return null;
    return entries.find((e) => e.slug === slug) ?? entries[0];
  }, [entries, slug]);

  useEffect(() => {
    if (entries && entries.length > 0 && !slug) {
      navigate(`${basePath}/${entries[0].slug}`, { replace: true });
    }
  }, [entries, slug, basePath, navigate]);

  // New entry → start reading from the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [active?.slug]);

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.group.toLowerCase().includes(q) ||
        (e.searchTerms ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [entries, search]);

  // Preserve content order within groups while grouping for the rail.
  const groups = useMemo(() => {
    const out: { group: string; items: RefEntry[] }[] = [];
    for (const entry of filtered) {
      const last = out[out.length - 1];
      if (last && last.group === entry.group) last.items.push(entry);
      else out.push({ group: entry.group, items: [entry] });
    }
    return out;
  }, [filtered]);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{lead}</p>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {entries === null && !error && (
        <div className="text-sm text-muted-foreground">Loading reference…</div>
      )}

      {entries !== null && entries.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No reference content yet — it lives in{" "}
          <code className="font-mono text-xs">
            resources/
            {kind === "wireframe"
              ? "wireframe-design-system-ref"
              : `excalibrr-design-${kind === "system" ? "system" : "patterns"}`}
            /content/
          </code>
          .
        </div>
      )}

      {entries !== null && entries.length > 0 && active && (
        <div className="flex items-start gap-10">
          {/* Rail */}
          <nav className="sticky top-10 w-56 shrink-0 max-lg:hidden">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${entries.length} entries`}
                className="h-8 w-full rounded-md border bg-transparent pl-8 pr-7 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pb-4 pr-1">
              {groups.length === 0 && (
                <div className="px-2 text-sm text-muted-foreground">
                  No matches for “{search}”
                </div>
              )}
              {groups.map(({ group, items }) => (
                <div key={group} className="mb-1">
                  <div className="px-2 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {group}
                  </div>
                  {items.map((entry) => {
                    const isActive = entry.slug === active.slug;
                    return (
                      <button
                        key={entry.slug}
                        type="button"
                        onClick={() => navigate(`${basePath}/${entry.slug}`)}
                        className={cn(
                          "flex w-full items-baseline gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-foreground/80 hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] tabular-nums",
                            isActive ? "text-primary/70" : "text-muted-foreground/50",
                          )}
                        >
                          {String(entry.order).padStart(2, "0")}
                        </span>
                        <span className="truncate">{entry.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>

          {/* Entry */}
          <article className="min-w-0 max-w-3xl flex-1">
            <header className="mb-8 border-b pb-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {active.title}
                </h2>
                {active.demoPath && (
                  <a
                    href={`${EXCALIBRR_DEMO_URL}${active.demoPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    title="Open the live page in the Excalibrr demo (must be running on :3000)"
                  >
                    Live in demo <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {active.intro}
              </p>
            </header>

            <div className="space-y-10 pb-16">
              {active.blocks.map((block, i) => (
                <RefBlockView key={`${active.slug}-${i}`} block={block} kind={kind} />
              ))}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
