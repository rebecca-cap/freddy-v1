import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  api,
  type ExternalResource,
  type ResourceCategory,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
}

const CATEGORIES: {
  key: ResourceCategory;
  icon: string;
  label: string;
  active: boolean;
}[] = [
  { key: "screenshots", icon: "📷", label: "Screenshots", active: false },
  { key: "links", icon: "🔗", label: "Links", active: true },
  { key: "interviews", icon: "📝", label: "Interviews", active: false },
  { key: "competitive", icon: "🧭", label: "Competitive", active: false },
  { key: "docs", icon: "📄", label: "Docs", active: false },
  { key: "loom", icon: "🎥", label: "Loom", active: false },
];

export default function ExternalResources({ slug }: Props) {
  const [active, setActive] = useState<ResourceCategory>("links");
  const [items, setItems] = useState<ExternalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const activeDef = CATEGORIES.find((c) => c.key === active)!;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await api.listExternalResources(slug);
      setItems(next);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = items.filter((i) => i.category === active);

  async function handleAdd(input: {
    title: string;
    url: string;
    note?: string;
  }) {
    setError(null);
    try {
      const item = await api.addExternalResource(slug, {
        category: active,
        ...input,
      });
      setItems((prev) => [...prev, item]); // optimistic-ish: server returns the row
      setAdding(false);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  }

  async function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((i) => i.id !== id)); // optimistic
    try {
      await api.deleteExternalResource(slug, id);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setItems(prev); // rollback
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">External resources</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Briefs, links, competitive refs, interview notes, Looms — grouped by
          type.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                disabled={!c.active}
                onClick={() => c.active && setActive(c.key)}
                title={c.active ? c.label : `${c.label} — coming soon`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  !c.active &&
                    "cursor-not-allowed bg-card/50 text-muted-foreground/60",
                  c.active &&
                    !isActive &&
                    "bg-card text-foreground hover:bg-muted",
                  isActive && "border-primary/40 bg-primary/10 text-primary",
                )}
              >
                <span>{c.icon}</span>
                {c.label}
                {c.active && (
                  <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[9px] tabular-nums text-muted-foreground">
                    {items.filter((i) => i.category === c.key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {activeDef.active ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {activeDef.label}
              </span>
              {!adding && (
                <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add {activeDef.label.toLowerCase().replace(/s$/, "")}
                </Button>
              )}
            </div>

            {adding && (
              <AddLinkForm
                onCancel={() => setAdding(false)}
                onSubmit={handleAdd}
              />
            )}

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : visible.length === 0 && !adding ? (
              <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No {activeDef.label.toLowerCase()} yet. Click "Add" to create one.
              </p>
            ) : (
              <ul className="divide-y rounded-md border">
                {visible.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start justify-between gap-3 px-3 py-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium hover:text-primary hover:underline"
                      >
                        {r.title}
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                      </a>
                      <div className="truncate text-xs text-muted-foreground">
                        {r.note ? r.note : r.url}
                      </div>
                    </div>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => handleDelete(r.id)}
                      className="shrink-0 text-muted-foreground/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            {activeDef.label} — coming soon.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AddLinkForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: { title: string; url: string; note?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = title.trim().length > 0 && url.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ title: title.trim(), url: url.trim(), note: note.trim() || undefined });
      }}
      className="space-y-2 rounded-md border bg-muted/30 p-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          New link
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground/60 hover:text-foreground"
          aria-label="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (e.g. Grizmo brief)"
        className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…"
        className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="w-full rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!canSubmit}>
          Add link
        </Button>
      </div>
    </form>
  );
}
