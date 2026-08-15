import { describe, expect, it } from "vitest";
import {
  loadAllPacks,
  loadGameVersionRegistry,
  loadManifest,
  listGenerationFiles,
} from "./node-loader";
import { createRepository } from "./repository";

const manifest = loadManifest();
const versionRegistry = loadGameVersionRegistry();
const packs = loadAllPacks(manifest);
const repo = createRepository({ manifest, packs, versionRegistry });

describe("manifest", () => {
  it("has one entry per generation file on disk", () => {
    const files = listGenerationFiles();
    expect(manifest.packs.map((p) => p.file.split("/").pop()).sort()).toEqual(files.sort());
  });
});

describe("species referential integrity", () => {
  it("every species' defaultFormId is one of its own formIds", () => {
    for (const species of repo.allSpecies) {
      expect(species.formIds).toContain(species.defaultFormId);
    }
  });

  it("every formId listed on a species resolves to an actual form", () => {
    for (const species of repo.allSpecies) {
      for (const formId of species.formIds) {
        expect(repo.getForm(formId), `${species.id} references missing form ${formId}`).toBeDefined();
      }
    }
  });

  it("evolvesFromSpeciesId always resolves to a real species", () => {
    for (const species of repo.allSpecies) {
      if (!species.evolvesFromSpeciesId) continue;
      expect(repo.getSpecies(species.evolvesFromSpeciesId), species.id).toBeDefined();
    }
  });

  it("evolution edges resolve and originate from the owning species", () => {
    for (const species of repo.allSpecies) {
      for (const edge of species.evolutions) {
        expect(edge.fromSpeciesId).toBe(species.id);
        expect(repo.getSpecies(edge.toSpeciesId), `${species.id} -> ${edge.toSpeciesId}`).toBeDefined();
      }
    }
  });

  it("national dex numbers are unique", () => {
    const seen = new Set<number>();
    for (const species of repo.allSpecies) {
      expect(seen.has(species.nationalDexNumber), `duplicate dex number ${species.nationalDexNumber}`).toBe(false);
      seen.add(species.nationalDexNumber);
    }
  });

  it("availability references only known version groups", () => {
    for (const species of repo.allSpecies) {
      for (const versionGroupId of species.availability) {
        expect(repo.getVersionGroup(versionGroupId), `${species.id} -> ${versionGroupId}`).toBeDefined();
      }
    }
  });
});

describe("form referential integrity", () => {
  it("every form's speciesId resolves to a real species", () => {
    for (const pack of packs) {
      for (const form of pack.forms) {
        expect(repo.getSpecies(form.speciesId), `form ${form.id} -> species ${form.speciesId}`).toBeDefined();
      }
    }
  });
});
