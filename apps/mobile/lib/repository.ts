import { createRepository } from "@pokedex/core";
import type { GameVersionRegistry, GenerationPack, Manifest } from "@pokedex/schema";

import manifest from "@pokedex/data/manifest.json";
import versionRegistry from "@pokedex/data/game-versions.json";
import gen1 from "@pokedex/data/generations/gen1.json";
import gen2 from "@pokedex/data/generations/gen2.json";
import gen3 from "@pokedex/data/generations/gen3.json";
import gen4 from "@pokedex/data/generations/gen4.json";
import gen5 from "@pokedex/data/generations/gen5.json";
import gen6 from "@pokedex/data/generations/gen6.json";
import gen7 from "@pokedex/data/generations/gen7.json";
import gen8 from "@pokedex/data/generations/gen8.json";
import gen9 from "@pokedex/data/generations/gen9.json";
import legendsZA from "@pokedex/data/generations/legends-za.json";

// Metro bundles these as static JSON (no fs access on-device), so every
// generation pack is imported explicitly here. Adding a new pack later
// means adding one import and one array entry, see README.md.
const packs = [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, legendsZA] as unknown as GenerationPack[];

export const repository = createRepository({
  manifest: manifest as unknown as Manifest,
  packs,
  versionRegistry: versionRegistry as unknown as GameVersionRegistry,
});
