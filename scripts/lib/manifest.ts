import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ManifestSchema, type Manifest, type ManifestEntry } from "@pokedex/schema";

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(here, "..", "..", "packages", "data");
export const MANIFEST_PATH = join(DATA_DIR, "manifest.json");

export function readManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) return { schemaVersion: 1, packs: [] };
  return ManifestSchema.parse(JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")));
}

export function writeManifest(manifest: Manifest): void {
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

export function upsertPackEntry(manifest: Manifest, entry: ManifestEntry): Manifest {
  const packs = manifest.packs.filter((p) => p.id !== entry.id);
  packs.push(entry);
  return { ...manifest, packs };
}

export function today(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, ".");
}
