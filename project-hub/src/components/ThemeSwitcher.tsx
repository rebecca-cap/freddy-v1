import { useEffect, useState } from "react";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeId = "pitfield" | "bone-ink" | "steelyard";

const THEMES: { id: ThemeId; label: string; blurb: string; swatch: string[] }[] = [
  {
    id: "pitfield",
    label: "Pitfield",
    blurb: "Warm dark · burnished copper · refined industrial",
    swatch: ["oklch(0.205 0.012 55)", "oklch(0.235 0.013 55)", "oklch(0.74 0.118 55)"],
  },
  {
    id: "bone-ink",
    label: "Bone & Ink",
    blurb: "Paper light · navy ink · rust ochre · editorial",
    swatch: ["oklch(0.972 0.008 82)", "oklch(0.225 0.03 255)", "oklch(0.56 0.155 38)"],
  },
  {
    id: "steelyard",
    label: "Steelyard",
    blurb: "Cool dark · patina green · precision workshop",
    swatch: ["oklch(0.185 0.008 245)", "oklch(0.215 0.009 245)", "oklch(0.74 0.115 155)"],
  },
];

const STORAGE_KEY = "hub.theme";
const DEFAULT_THEME: ThemeId = "pitfield";

function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  // Toggle .dark for the one badge variant that still uses Tailwind's `dark:` prefix.
  document.documentElement.classList.toggle("dark", id !== "bone-ink");
}

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    return saved && THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    applyTheme(current);
    window.localStorage.setItem(STORAGE_KEY, current);
  }, [current]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-theme-switcher]")) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const currentTheme = THEMES.find((t) => t.id === current) ?? THEMES[0];

  return (
    <div
      data-theme-switcher
      className="fixed bottom-5 right-5 z-50"
    >
      {open && (
        <div className="mb-2 w-[300px] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl">
          <div className="border-b px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Theme preview
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Pick a direction — easy to refine after.
            </div>
          </div>
          <ul className="p-1.5">
            {THEMES.map((t) => {
              const active = t.id === current;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrent(t.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      active ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    <span className="flex shrink-0 -space-x-1.5 pt-0.5">
                      {t.swatch.map((c, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 rounded-full border border-background/60 shadow-sm"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight">
                        {t.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {t.blurb}
                      </span>
                    </span>
                    {active && (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-full border bg-card/90 px-3.5 py-2 text-xs font-medium shadow-lg backdrop-blur-sm transition-colors hover:bg-card",
          open && "ring-2 ring-ring/40",
        )}
        title="Switch theme"
      >
        <Palette className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">Theme:</span>
        <span className="font-semibold">{currentTheme.label}</span>
      </button>
    </div>
  );
}
