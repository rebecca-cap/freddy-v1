import { useCallback, useEffect, useMemo, useState } from "react";
import NewProjectDialog from "@/components/NewProjectDialog";
import ProjectControlBar, {
  SearchBox,
  type HubView,
  type PhaseCounts,
  type PhaseFilter,
  type ProductFilter,
} from "@/components/ProjectControlBar";
import { phaseFor, productFor } from "@/components/projects/util";
import ProjectList from "@/components/ProjectList";
import ProjectListView from "@/components/ProjectListView";
import { api, type Identity, type ProjectSummary } from "@/lib/api";

const HUB_VIEW_STORAGE_KEY = "freddy.hub.view";

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<HubView>(() => {
    const stored = localStorage.getItem(HUB_VIEW_STORAGE_KEY);
    return stored === "list" ? "list" : "cards";
  });
  const [search, setSearch] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");
  const [archivedOnly, setArchivedOnly] = useState(false);
  // Machine identity — the creator fallback for records that predate the
  // creator field. null until loaded (or if the lookup fails).
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    api.getIdentity().then(setIdentity).catch(() => setIdentity(null));
  }, []);

  const filteredProjects = useMemo(() => {
    // Archived projects live behind the Archived toggle; the default view
    // hides them entirely.
    let next = projects.filter((project) => !!project.archived === archivedOnly);
    const query = search.trim().toLowerCase();
    if (query) {
      next = next.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.branch.toLowerCase().includes(query),
      );
    }
    if (pinnedOnly) next = next.filter((project) => !!project.pinned);
    // productFor() prefers the stored field, so legacy regex-derived products
    // still group sensibly under the same filter.
    if (productFilter !== "all") {
      next = next.filter((project) => productFor(project) === productFilter);
    }
    // Phase chips never apply in archived mode — archived projects' phase is
    // always "archived", so any chip would zero the list.
    if (!archivedOnly && phaseFilter !== "all") {
      next = next.filter((project) => phaseFor(project) === phaseFilter);
    }
    // Pinned first; within each group keep the server order (createdAt desc).
    return [
      ...next.filter((project) => !!project.pinned),
      ...next.filter((project) => !project.pinned),
    ];
  }, [projects, search, pinnedOnly, productFilter, phaseFilter, archivedOnly]);

  // Chip counts come from the full set (not the search/pin/product-filtered
  // one) so they stay stable while other filters move.
  const phaseCounts = useMemo<PhaseCounts>(() => {
    const live = projects.filter((project) => !project.archived);
    return {
      lofi: live.filter((project) => phaseFor(project) === "lofi").length,
      hifi: live.filter((project) => phaseFor(project) === "hifi").length,
      handoff: live.filter((project) => phaseFor(project) === "handoff").length,
      archived: projects.length - live.length,
    };
  }, [projects]);

  const handleArchivedOnlyChange = (next: boolean) => {
    setArchivedOnly(next);
    // Phase filtering is skipped in archived mode; clear the chip so it
    // doesn't sit highlighted while having no effect.
    if (next) setPhaseFilter("all");
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await api.listProjects();
      setProjects(next);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleViewChange = (next: HubView) => {
    setView(next);
    localStorage.setItem(HUB_VIEW_STORAGE_KEY, next);
  };

  const handleTogglePin = useCallback(
    (slug: string) => {
      const current = projects.find((p) => p.slug === slug);
      if (!current) return;
      const nextPinned = !current.pinned;
      // Optimistic flip; revert via refresh() if the PATCH fails.
      setProjects((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, pinned: nextPinned } : p)),
      );
      api.setPinned(slug, nextPinned).catch(() => {
        refresh();
      });
    },
    [projects, refresh],
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Project Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every initiative in one place. Each project branches off the Main Prototype Site.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Projects ({archivedOnly ? phaseCounts.archived : projects.length - phaseCounts.archived})
        </h2>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SearchBox search={search} onSearchChange={setSearch} />
          <div className="ml-auto">
            <NewProjectDialog onCreated={refresh} />
          </div>
        </div>
        <ProjectControlBar
          view={view}
          onViewChange={handleViewChange}
          totalCount={filteredProjects.length}
          pinnedOnly={pinnedOnly}
          onPinnedOnlyChange={setPinnedOnly}
          productFilter={productFilter}
          onProductFilterChange={setProductFilter}
          phaseFilter={phaseFilter}
          onPhaseFilterChange={setPhaseFilter}
          phaseCounts={phaseCounts}
          archivedOnly={archivedOnly}
          onArchivedOnlyChange={handleArchivedOnlyChange}
        />
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading projects...</div>
        ) : projects.length > 0 && filteredProjects.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {search.trim() !== ""
              ? `No projects match “${search}”`
              : "No projects match the current filters"}
          </div>
        ) : view === "cards" ? (
          <ProjectList
            projects={filteredProjects}
            onTogglePin={handleTogglePin}
            fallbackCreator={identity}
          />
        ) : (
          <ProjectListView
            projects={filteredProjects}
            onTogglePin={handleTogglePin}
            fallbackCreator={identity}
          />
        )}
      </section>
    </>
  );
}
