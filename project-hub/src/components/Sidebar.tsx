import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutGrid,
  Loader2,
  LogOut,
  Palette,
  PenLine,
  Play,
  Square,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api, type Identity, type RuntimeStatus } from "@/lib/api";
import { initialsFor } from "@/components/projects/util";

type ItemBase = {
  label: string;
  icon?: React.ReactNode;
  productDot?: "sdi" | "pe" | "ss";
  count?: number | string;
};

type SectionItem =
  | (ItemBase & { kind: "navlink"; to: string; matchPaths?: string[] })
  | (ItemBase & { kind: "external"; href: string })
  | (ItemBase & { kind: "protobase"; protoId: string; port: number })
  | (ItemBase & { kind: "disabled" });

type Section = { heading: string; items: SectionItem[] };

const SECTIONS = (): Section[] => [
  {
    heading: "Main Prototypes",
    items: [
      // Each product has its own proto-base dev server managed by the hub: the
      // row has its own start/stop control + running indicator (ProtoBaseControl).
      // 'pe' -> :5173, 'ss' (OSP / Selling Platform) -> :5175. 'sdi' isn't built yet.
      {
        kind: "protobase",
        label: "Pricing Engine",
        productDot: "pe",
        protoId: "pe",
        port: 5173,
      },
      { kind: "disabled", label: "S & D · Incab", productDot: "sdi", count: "soon" },
      {
        kind: "protobase",
        label: "Selling Platform",
        productDot: "ss",
        protoId: "ss",
        port: 5175,
      },
    ],
  },
  {
    heading: "System",
    items: [
      {
        kind: "navlink",
        label: "Design System",
        icon: <Palette className="h-4 w-4" />,
        to: "/design-system",
        matchPaths: ["/design-system"],
      },
      {
        kind: "navlink",
        label: "Wireframe DS",
        icon: <PenLine className="h-4 w-4" />,
        to: "/wireframe-system",
        matchPaths: ["/wireframe-system"],
      },
      {
        kind: "navlink",
        label: "Design Patterns",
        icon: <LayoutGrid className="h-4 w-4" />,
        to: "/design-patterns",
        matchPaths: ["/design-patterns"],
      },
      { kind: "disabled", label: "Obsidian KB", icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
];

const PRODUCT_DOT_CLASS: Record<NonNullable<ItemBase["productDot"]>, string> = {
  sdi: "bg-blue-600",
  pe: "bg-violet-600",
  ss: "bg-teal-600",
};

function ProductDot({ kind }: { kind: NonNullable<ItemBase["productDot"]> }) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
        PRODUCT_DOT_CLASS[kind],
      )}
    />
  );
}

function ItemIcon({ item }: { item: SectionItem }) {
  if (item.productDot) return <ProductDot kind={item.productDot} />;
  if (item.icon) {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
        {item.icon}
      </span>
    );
  }
  return <span className="h-4 w-4 shrink-0" />;
}

export default function Sidebar() {
  const location = useLocation();
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    api
      .getIdentity()
      .then(setIdentity)
      .catch(() => setIdentity(null));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .listProjects()
      .then((projects) => {
        if (active) setProjectCount(projects.length);
      })
      .catch(() => {
        if (active) setProjectCount(null);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const sections = SECTIONS();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      {/* Brand — this IS the home nav; there's no parent above Project Hub */}
      <Link
        to="/"
        className="flex items-center gap-3 border-b px-5 py-4 transition-colors hover:bg-muted/40"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
          P
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold leading-tight">
              Project Hub
            </div>
            {projectCount !== null && <CountBadge count={projectCount} />}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Hybrid prototype platform
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section) => (
          <div key={section.heading}>
            <div className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {section.heading}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User chip */}
      <button
        type="button"
        className="flex items-center gap-3 border-t px-4 py-3 text-left transition-colors hover:bg-muted/50"
        title="Sign out (not wired up yet)"
      >
        {identity?.avatarUrl ? (
          <img
            src={identity.avatarUrl}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {identity ? initialsFor(identity.name) : "··"}
          </span>
        )}
        <span className="flex-1">
          <span className="block text-sm font-semibold leading-tight">
            {identity?.name ?? "—"}
          </span>
          <span className="block text-[11px] text-muted-foreground">
            {identity?.githubLogin ? `@${identity.githubLogin}` : "Local user"}
          </span>
        </span>
        <LogOut className="h-4 w-4 text-muted-foreground" />
      </button>
    </aside>
  );
}

const SIDEBAR_ROW =
  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";

function SidebarItem({ item }: { item: SectionItem }) {
  const location = useLocation();
  const baseRow = SIDEBAR_ROW;

  if (item.kind === "protobase") {
    return (
      <ProtoBaseControl
        protoId={item.protoId}
        port={item.port}
        label={item.label}
        dot={item.productDot ?? "pe"}
      />
    );
  }

  if (item.kind === "navlink") {
    const matchedExtra = item.matchPaths?.some((p) =>
      p === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(p),
    );
    return (
      <NavLink
        to={item.to}
        end={item.to === "/"}
        className={({ isActive }) => {
          const active = isActive || matchedExtra;
          return cn(
            baseRow,
            active
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-muted/60",
          );
        }}
      >
        <ItemIcon item={item} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.count !== undefined && <CountBadge count={item.count} />}
      </NavLink>
    );
  }

  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={cn(
          baseRow,
          "text-foreground hover:bg-muted/60",
        )}
        title={`Opens ${item.href} in a new tab`}
      >
        <ItemIcon item={item} />
        <span className="flex-1 truncate">{item.label}</span>
        <span className="text-xs text-muted-foreground transition-opacity group-hover:opacity-100">
          ↗
        </span>
      </a>
    );
  }

  // disabled
  return (
    <span
      aria-disabled="true"
      className={cn(
        baseRow,
        "cursor-not-allowed text-muted-foreground/60",
      )}
      title="Coming soon"
    >
      <ItemIcon item={item} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.count !== undefined && <CountBadge count={item.count} muted />}
    </span>
  );
}

/**
 * A proto-base row is a managed dev server, not a static link: the hub can
 * start/stop it and reflect running state. Each product has its own proto-base
 * ('pe' -> :5173, 'ss' -> :5175). Polls status every 5s; the label opens the
 * running URL in a new tab.
 */
function ProtoBaseControl({
  protoId,
  port,
  label,
  dot,
}: {
  protoId: string;
  port: number;
  label: string;
  dot: NonNullable<ItemBase["productDot"]>;
}) {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    api
      .protoBaseStatus(protoId)
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [protoId]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  const running = status?.running ?? false;
  const url = status?.url ?? `http://localhost:${port}`;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      if (running) await api.stopProtoBase(protoId);
      else await api.startProtoBase(protoId);
      refresh();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className={cn(SIDEBAR_ROW, "text-foreground hover:bg-muted/60")}>
        <ProductDot kind={dot} />
        {running ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 truncate hover:underline"
            title={`Open ${url} in a new tab`}
          >
            {label}
          </a>
        ) : (
          <span className="flex-1 truncate">{label}</span>
        )}
        <span
          className={cn(
            "inline-block h-2 w-2 shrink-0 rounded-full",
            running ? "bg-emerald-500" : "bg-muted-foreground/30",
          )}
          title={running ? `Running on :${port}` : "Stopped"}
        />
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-label={
            running ? `Stop ${label} proto-base` : `Start ${label} proto-base`
          }
          title={
            running
              ? `Stop proto-base (:${port})`
              : `Start proto-base (:${port})`
          }
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : running ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      {error && (
        <span
          className="px-3 pb-1 text-[10px] leading-tight text-red-600"
          title={error}
        >
          {error.length > 64 ? `${error.slice(0, 64)}…` : error}
        </span>
      )}
    </div>
  );
}

function CountBadge({
  count,
  muted = false,
}: {
  count: number | string;
  muted?: boolean;
}) {
  return (
    <Badge
      variant={muted ? "muted" : "secondary"}
      className="h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[10px] font-semibold"
    >
      {count}
    </Badge>
  );
}
