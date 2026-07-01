// Design reference content — the vendored Excalibrr component reference
// ("system") and layout rulebook ("patterns") rendered by /design-system and
// /design-patterns. Content lives in the Hub repo at
// resources/excalibrr-design-{system,patterns}/content/ as one JSON file per
// entry; the API returns them sorted. The same JSON is the source of truth for
// the generated markdown that project CLAUDE.md files point Claude sessions at
// (scripts/build-design-refs-md.mjs).

export type RefKind = "system" | "patterns" | "wireframe";

// Where the live Excalibrr demo runs when started (`yarn dev` in
// repos/excalibrr-mcp-server). Entry pages link out via `demoPath`.
export const EXCALIBRR_DEMO_URL = "http://localhost:3000";

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  notes: string;
}

export interface VariantRow {
  name: string;
  when: string;
  code?: string;
}

export interface TokenRow {
  token: string;
  value: string;
  use: string;
}

export type RefBlock =
  // A captured screenshot of the real component/layout rendered in the demo.
  // `image` is relative to the resource root, e.g. "specimens/buttons/01-themes.png".
  | { type: "specimen"; title: string; image: string; caption?: string; wide?: boolean }
  // Editorial prose. Paragraphs split on blank lines; `inline code` allowed.
  | { type: "usage"; title?: string; body: string }
  | { type: "props"; title: string; intro?: string; rows: PropRow[] }
  | { type: "variants"; title: string; intro?: string; rows: VariantRow[] }
  // `lang` sets the markdown code-fence language for the generated docs
  // (default "tsx"); the wireframe reference uses "html"/"css".
  | { type: "code"; title?: string; code: string; note?: string; lang?: string }
  | { type: "dosdonts"; title?: string; items: { do: string; dont: string; why?: string }[] }
  | { type: "gotchas"; title?: string; items: { title: string; detail: string }[] }
  | { type: "tokens"; title: string; intro?: string; rows: TokenRow[] }
  // Numbered laws for patterns — the "carte blanche" rule statements.
  | { type: "rules"; title: string; intro?: string; items: { rule: string; why?: string }[] };

export interface RefEntry {
  slug: string;
  title: string;
  order: number;
  // Rail grouping, e.g. "Foundations" / "Components" / "Surfaces".
  group: string;
  // 1–3 sentence editorial lead under the entry title.
  intro: string;
  // Route in the Excalibrr demo, e.g. "/DesignSystem/Buttons".
  demoPath?: string;
  // Extra search keywords beyond the title (component names, aliases).
  searchTerms?: string[];
  blocks: RefBlock[];
}

export interface DesignRefsResponse {
  entries: RefEntry[];
  // Files that failed to parse — surfaced quietly so a bad JSON never
  // blanks the whole page.
  warnings: string[];
}

/** URL for a file inside a design-ref resource dir (specimen images, md). */
export function designRefFileUrl(kind: RefKind, relPath: string): string {
  const rel = relPath.split("/").map(encodeURIComponent).join("/");
  return `/api/design-refs/${kind}/files/${rel}`;
}

export async function fetchDesignRefs(kind: RefKind): Promise<DesignRefsResponse> {
  const res = await fetch(`/api/design-refs/${kind}`);
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error ?? JSON.stringify(body);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  return (await res.json()) as DesignRefsResponse;
}
