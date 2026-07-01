import type { ProjectSummary } from "@/lib/api";
import type { ProjectPhaseKind } from "./StatusChip";
import type { ProductKind } from "./ProductChip";

// Lifecycle phase is derived server-side; tolerate stale payloads lacking it.
export function phaseFor(p: ProjectSummary): ProjectPhaseKind {
  return p.phase ?? "kickoff";
}

// Prefer the real backend field (stamped at creation). Legacy records lack it,
// so fall back to deriving a product hint from the name/branch when possible,
// otherwise "Pricing Engine" (the default product).
export function productFor(p: ProjectSummary): ProductKind {
  if (p.product === "sdi" || p.product === "pe" || p.product === "ss") {
    return p.product;
  }
  const hay = `${p.name} ${p.branch}`.toLowerCase();
  if (/(quote|sell|offer)/.test(hay)) return "ss";
  if (/(carrier|incab|s&d|site)/.test(hay)) return "sdi";
  return "pe";
}

// "Frank Overland" → "FO", "Frank" → "F", "" → "??".
export function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}
