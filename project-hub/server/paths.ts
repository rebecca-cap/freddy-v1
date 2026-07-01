import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const HUB_ROOT = path.resolve(__dirname, "..");
export const HUB_DATA_DIR = path.join(HUB_ROOT, "data");
export const HUB_PROJECTS_FILE = path.join(HUB_DATA_DIR, "projects.json");

export const HUB_API_PORT = Number(process.env.HUB_API_PORT ?? 3030);
export const HUB_WEB_PORT = Number(process.env.HUB_WEB_PORT ?? 5174);

export const FREDDY_ROOT = process.env.FREDDY_ROOT ?? "/Users/frankoverland/freddy";
export const PROTO_BASE_PATH =
  process.env.PROTO_BASE_PATH ?? path.join(FREDDY_ROOT, "proto-base");

// The OSP (Selling Platform) proto-base, cloned from production. Its own repo
// on branch freddy/osp-base — a separate git repo from the PE proto-base.
export const PROTO_BASE_OSP_PATH =
  process.env.PROTO_BASE_OSP_PATH ?? path.join(FREDDY_ROOT, "proto-base-osp");

// Each product has its own proto-base dev server. Keyed by product id
// ('pe' -> Pricing Engine, 'ss' -> Selling Platform / OSP). 'sdi' is not built
// yet. Unknown/absent ids resolve to 'pe' (see protoBaseFor / protoBasePathForProduct).
export type ProtoBaseId = "pe" | "ss";

export const PROTO_BASES: Record<
  ProtoBaseId,
  { id: ProtoBaseId; path: string; port: number; label: string }
> = {
  pe: {
    id: "pe",
    path: PROTO_BASE_PATH,
    port: Number(process.env.PROTO_BASE_PORT_HTTP ?? 5173),
    label: "Pricing Engine",
  },
  ss: {
    id: "ss",
    path: PROTO_BASE_OSP_PATH,
    port: Number(process.env.PROTO_BASE_OSP_PORT_HTTP ?? 5175),
    label: "Selling Platform",
  },
};

// Resolve a proto-base by id; unknown/absent ids default to pe per contract.
export function protoBaseFor(
  id: string | undefined,
): { id: ProtoBaseId; path: string; port: number; label: string } {
  return PROTO_BASES[id as ProtoBaseId] ?? PROTO_BASES.pe;
}

// product (sdi|pe|ss) -> proto-base repo root. Default/unknown -> pe. The
// scaffolding layer (worktree creation + node_modules seed) resolves the base
// repo through this so a project/variant forks from the repo matching its product.
export const PROTO_BASE_PATHS: Record<string, string> = {
  pe: PROTO_BASE_PATH,
  ss: PROTO_BASE_OSP_PATH,
};

export function protoBasePathForProduct(product?: string): string {
  return (product && PROTO_BASE_PATHS[product]) || PROTO_BASE_PATH;
}

export const EXCALIBRR_PATH =
  process.env.EXCALIBRR_PATH ?? path.join(FREDDY_ROOT, "excalibrr-freddy");
export const PROJECTS_PATH =
  process.env.PROJECTS_PATH ?? path.join(FREDDY_ROOT, "projects");

// Project prototype ports. Start at 5180 (above proto-base :5173 and hub :5174)
// to stay clear of the Excalibrr demo on :3000 which freely auto-bumps to
// :3001, :3002, etc. when restarted.
export const PORT_RANGE_START = Number(process.env.PORT_RANGE_START ?? 5180);
export const PORT_RANGE_END = Number(process.env.PORT_RANGE_END ?? 5230);

export function projectDir(slug: string): string {
  return path.join(PROJECTS_PATH, slug);
}

export function projectPrototypeDir(slug: string): string {
  return path.join(projectDir(slug), "prototype");
}

export function projectLofiDir(slug: string): string {
  return path.join(projectDir(slug), "design-system", "lofi");
}

// The wireframe-index skill is bundled per-project (a copy of the hub-vendored
// skill) so the CLAUDE.md backup path travels with the project folder — works
// in Cowork, in a clone, or on a teammate's machine without the hub repo.
// Lives at the lofi level so rounds reference it relatively (../wireframe-index-skill/).
export function projectWireframeIndexSkillDir(slug: string): string {
  return path.join(projectLofiDir(slug), "wireframe-index-skill");
}

export function projectKickoffPath(slug: string): string {
  return path.join(projectLofiDir(slug), "KICKOFF.md");
}

// The shared lo-fi design system is vendored in THIS hub repo so it travels
// with a clone. Rounds reference it by absolute path.
export const WIREFRAME_DESIGN_SYSTEM_PATH = path.join(
  HUB_ROOT,
  "resources",
  "wireframe-design-system",
);

// The wireframe-index skill is vendored alongside it — CLAUDE.md templates
// point here as the fallback when /wireframe-index isn't installed as a skill.
export const WIREFRAME_INDEX_SKILL_PATH = path.join(
  HUB_ROOT,
  "resources",
  "skills",
  "wireframe-index",
);

// Hi-fi siblings of the wireframe design system: the Excalibrr component
// reference and the layout-pattern rulebook. Vendored here so they travel with
// a clone; project CLAUDE.md templates point hi-fi prototype work at them the
// same way lo-fi rounds point at the wireframe DS. The Hub renders the same
// content at /design-system and /design-patterns.
export const EXCALIBRR_DESIGN_SYSTEM_PATH = path.join(
  HUB_ROOT,
  "resources",
  "excalibrr-design-system",
);
export const EXCALIBRR_DESIGN_PATTERNS_PATH = path.join(
  HUB_ROOT,
  "resources",
  "excalibrr-design-patterns",
);

// The lo-fi counterpart of the two above: the rendered/browsable twin of the
// vendored wireframe design system. The RAW source lives in
// resources/wireframe-design-system/ (untouched — lo-fi rounds build FROM it);
// this dir holds the reference content/specimens/generated-md the Hub renders
// at /wireframe-system, kept separate so md generation never clobbers the raw
// source's own CLAUDE.md.
export const WIREFRAME_DESIGN_REF_PATH = path.join(
  HUB_ROOT,
  "resources",
  "wireframe-design-system-ref",
);

export function projectResourcesDir(slug: string): string {
  return path.join(projectDir(slug), "resources");
}

export function projectExcalibrrSymlink(slug: string): string {
  return path.join(projectDir(slug), "excalibrr-freddy");
}

export function projectVariantsDir(slug: string): string {
  return path.join(projectDir(slug), "variants");
}

export function variantDir(slug: string, vSlug: string): string {
  return path.join(projectVariantsDir(slug), vSlug);
}

export function variantPrototypeDir(slug: string, vSlug: string): string {
  return path.join(variantDir(slug, vSlug), "prototype");
}

export function variantExcalibrrSymlink(slug: string, vSlug: string): string {
  return path.join(variantDir(slug, vSlug), "excalibrr-freddy");
}

export function variantClaudeMd(slug: string, vSlug: string): string {
  return path.join(variantDir(slug, vSlug), "CLAUDE.md");
}

// Card cover screenshot. Lives in the project dir (NOT prototype/) so it
// never dirties the project branch; the Hub serves it when present.
export function projectCoverPath(slug: string): string {
  return path.join(projectDir(slug), "cover.png");
}

export function projectMetaFile(slug: string): string {
  return path.join(projectDir(slug), ".freddy-project.json");
}

export function projectClaudeMd(slug: string): string {
  return path.join(projectDir(slug), "CLAUDE.md");
}

export function projectReadme(slug: string): string {
  return path.join(projectDir(slug), "README.md");
}
