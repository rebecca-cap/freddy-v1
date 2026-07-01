import { Archive, ChevronDown, LayoutGrid, List, Search, Star, X } from "lucide-react";
import {
  PRODUCT_KINDS,
  PRODUCT_LABEL,
  type ProductKind,
} from "@/components/projects/ProductChip";
import { cn } from "@/lib/utils";

export type HubView = "cards" | "list";

export type ProductFilter = ProductKind | "all";

export type PhaseFilter = "all" | "lofi" | "hifi" | "handoff";

export interface PhaseCounts {
  lofi: number;
  hifi: number;
  handoff: number;
  archived: number;
}

// Single-select phase chips; kickoff intentionally has no chip (default young
// state) — "All" covers it.
const PHASE_CHIPS: { value: Exclude<PhaseFilter, "all">; label: string }[] = [
  { value: "lofi", label: "Lo-fi" },
  { value: "hifi", label: "Hi-fi" },
  { value: "handoff", label: "Handed off" },
];

interface Props {
  view: HubView;
  onViewChange: (next: HubView) => void;
  totalCount: number;
  pinnedOnly: boolean;
  onPinnedOnlyChange: (v: boolean) => void;
  productFilter: ProductFilter;
  onProductFilterChange: (v: ProductFilter) => void;
  phaseFilter: PhaseFilter;
  onPhaseFilterChange: (v: PhaseFilter) => void;
  phaseCounts: PhaseCounts;
  archivedOnly: boolean;
  onArchivedOnlyChange: (v: boolean) => void;
}

export default function ProjectControlBar({
  view,
  onViewChange,
  totalCount,
  pinnedOnly,
  onPinnedOnlyChange,
  productFilter,
  onProductFilterChange,
  phaseFilter,
  onPhaseFilterChange,
  phaseCounts,
  archivedOnly,
  onArchivedOnlyChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <ViewToggle view={view} onViewChange={onViewChange} />

      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip active>All ({totalCount})</FilterChip>
        <FilterChip
          active={pinnedOnly}
          onClick={() => onPinnedOnlyChange(!pinnedOnly)}
        >
          <Star className="h-3 w-3 text-amber-600" />
          Pinned
        </FilterChip>
        {PHASE_CHIPS.map(({ value, label }) => (
          <FilterChip
            key={value}
            active={phaseFilter === value}
            onClick={() =>
              onPhaseFilterChange(phaseFilter === value ? "all" : value)
            }
          >
            {label} ({phaseCounts[value]})
          </FilterChip>
        ))}
        <ProductFilterChip
          value={productFilter}
          onChange={onProductFilterChange}
        />
        <FilterChip
          active={archivedOnly}
          muted
          onClick={() => onArchivedOnlyChange(!archivedOnly)}
        >
          <Archive className="h-3 w-3" />
          Archived ({phaseCounts.archived})
        </FilterChip>
        <FilterChip disabled tooltip="Creator filter — coming soon">
          Creator
          <span className="opacity-60">: All</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </FilterChip>
      </div>
    </div>
  );
}

function ViewToggle({ view, onViewChange }: Pick<Props, "view" | "onViewChange">) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-card p-[3px]">
      <ToggleButton
        active={view === "cards"}
        onClick={() => onViewChange("cards")}
        icon={<LayoutGrid className="h-3.5 w-3.5" />}
        label="Cards"
      />
      <ToggleButton
        active={view === "list"}
        onClick={() => onViewChange("list")}
        icon={<List className="h-3.5 w-3.5" />}
        label="List"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function FilterChip({
  children,
  active = false,
  muted = false,
  disabled = false,
  tooltip,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  // Active state renders muted (gray) instead of primary — used for the
  // archived-only toggle so it reads as a different mode, not another filter.
  muted?: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
}) {
  return (
    <span
      title={disabled ? tooltip : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        active && !muted && "border-primary/30 bg-primary/10 text-primary",
        active && muted && "border-foreground/20 bg-muted text-foreground/70",
        !active && !disabled &&
          "cursor-pointer border-border bg-card text-muted-foreground hover:border-primary",
        disabled && "cursor-not-allowed border-border bg-card/50 text-muted-foreground/50",
        onClick && !disabled && "cursor-pointer",
      )}
    >
      {children}
    </span>
  );
}

function ProductFilterChip({
  value,
  onChange,
}: {
  value: ProductFilter;
  onChange: (v: ProductFilter) => void;
}) {
  const active = value !== "all";
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary",
      )}
    >
      Product
      <span className="opacity-60">:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductFilter)}
        aria-label="Filter by product"
        className="cursor-pointer appearance-none bg-transparent outline-none"
      >
        <option value="all">All</option>
        {PRODUCT_KINDS.map((kind) => (
          <option key={kind} value={kind}>
            {PRODUCT_LABEL[kind]}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none h-3 w-3 opacity-60" />
    </label>
  );
}

export function SearchBox({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex w-[280px] items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-[13px]">
      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search projects…"
        aria-label="Search projects"
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
      />
      {search !== "" && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
