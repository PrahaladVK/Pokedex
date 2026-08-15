import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GameVersionRegistrySchema,
  GenerationPackSchema,
  ManifestSchema,
  type GameVersionRegistry,
  type GenerationPack,
  type Manifest,
} from "@pokedex/schema";

// Node-only data loader (fs-based) for scripts and tests. Not exported from
// the package's main index: the mobile app has no `fs`, so it loads data via
// static JSON imports instead and passes them into createRepository directly.

function dataDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "..", "..", "data");
}

export function loadManifest(): Manifest {
  const raw = readFileSync(join(dataDir(), "manifest.json"), "utf-8");
  return ManifestSchema.parse(JSON.parse(raw));
}

export function loadGameVersionRegistry(): GameVersionRegistry {
  const raw = readFileSync(join(dataDir(), "game-versions.json"), "utf-8");
  return GameVersionRegistrySchema.parse(JSON.parse(raw));
}

export function loadGenerationPack(relativeFile: string): GenerationPack {
  const raw = readFileSync(join(dataDir(), relativeFile), "utf-8");
  return GenerationPackSchema.parse(JSON.parse(raw));
}

export function loadAllPacks(manifest: Manifest = loadManifest()): GenerationPack[] {
  return manifest.packs.map((entry) => loadGenerationPack(entry.file));
}

export function listGenerationFiles(): string[] {
  return readdirSync(join(dataDir(), "generations")).filter((f) => f.endsWith(".json"));
}
