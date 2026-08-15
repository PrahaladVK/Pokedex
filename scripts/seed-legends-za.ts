// Legends Z-A isn't fully on PokeAPI yet and we don't have a verified
// roster/evolution source for it, so this just seeds an empty but valid
// pack marked "partial". Fill it in later via sync-pokeapi.ts or by
// hand-editing generations/legends-za.json, no schema changes needed.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { GenerationPackSchema } from "@pokedex/schema";
import { DATA_DIR, readManifest, today, upsertPackEntry, writeManifest } from "./lib/manifest";

const pack = GenerationPackSchema.parse({
  meta: {
    id: "legends-za",
    schemaVersion: 1,
    dataVersion: today(),
    sourceUpdatedAt: new Date().toISOString(),
    status: "partial",
  },
  species: [],
  forms: [],
});

const fileName = "generations/legends-za.json";
writeFileSync(join(DATA_DIR, fileName), JSON.stringify(pack, null, 2) + "\n");

const manifest = upsertPackEntry(readManifest(), { ...pack.meta, file: fileName });
writeManifest(manifest);

console.log("Seeded legends-za.json (partial, 0 species) and updated manifest.json");
