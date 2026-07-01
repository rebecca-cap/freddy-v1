import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { projectResourcesDir } from "./paths.js";

export type ResourceCategory =
  | "links"
  | "docs"
  | "loom"
  | "competitive"
  | "interviews"
  | "screenshots";

export interface ExternalResource {
  id: string;
  category: ResourceCategory;
  title: string;
  url: string;
  note?: string;
  createdAt: string; // ISO
}

function externalResourcesFile(slug: string): string {
  return path.join(projectResourcesDir(slug), "external.json");
}

export async function listExternalResources(
  slug: string,
): Promise<ExternalResource[]> {
  try {
    const raw = await fs.readFile(externalResourcesFile(slug), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ExternalResource[];
  } catch {
    return [];
  }
}

async function writeExternalResources(
  slug: string,
  items: ExternalResource[],
): Promise<void> {
  const dir = projectResourcesDir(slug);
  await fs.mkdir(dir, { recursive: true });
  const file = externalResourcesFile(slug);
  const tmp = path.join(dir, "external.tmp.json");
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export interface AddExternalResourceInput {
  category: ResourceCategory;
  title: string;
  url: string;
  note?: string;
}

export async function addExternalResource(
  slug: string,
  input: AddExternalResourceInput,
): Promise<ExternalResource> {
  const title = (input.title ?? "").trim();
  const url = (input.url ?? "").trim();
  if (!title) throw new Error("title is required");
  if (!url) throw new Error("url is required");

  const item: ExternalResource = {
    id: randomUUID(),
    category: input.category,
    title,
    url,
    note: input.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const items = await listExternalResources(slug);
  items.push(item);
  await writeExternalResources(slug, items);
  return item;
}

export async function deleteExternalResource(
  slug: string,
  id: string,
): Promise<void> {
  const items = await listExternalResources(slug);
  const next = items.filter((i) => i.id !== id);
  await writeExternalResources(slug, next);
}
