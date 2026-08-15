import type {
  Form,
  GameVersionRegistry,
  GenerationPack,
  Manifest,
  Region,
  Species,
  VersionGroup,
} from "@pokedex/schema";
import { filterSpecies, type SpeciesFilter } from "./filters";
import { createSearchIndex, type SearchIndex } from "./search";

export interface Repository {
  manifest: Manifest;
  versionRegistry: GameVersionRegistry;
  allSpecies: Species[];
  search: SearchIndex["search"];
  getSpecies(id: string): Species | undefined;
  getSpeciesByDexNumber(n: number): Species | undefined;
  getForm(id: string): Form | undefined;
  getFormsForSpecies(speciesId: string): Form[];
  getVersionGroup(id: string): VersionGroup | undefined;
  listSpecies(filter?: SpeciesFilter): Species[];
}

export interface CreateRepositoryOptions {
  manifest: Manifest;
  packs: GenerationPack[];
  versionRegistry: GameVersionRegistry;
}

export function createRepository({ manifest, packs, versionRegistry }: CreateRepositoryOptions): Repository {
  const speciesById = new Map<string, Species>();
  const speciesByDexNumber = new Map<number, Species>();
  const formById = new Map<string, Form>();
  const formsBySpeciesId = new Map<string, Form[]>();

  for (const pack of packs) {
    for (const species of pack.species) {
      speciesById.set(species.id, species);
      speciesByDexNumber.set(species.nationalDexNumber, species);
    }
    for (const form of pack.forms) {
      formById.set(form.id, form);
      const bucket = formsBySpeciesId.get(form.speciesId) ?? [];
      bucket.push(form);
      formsBySpeciesId.set(form.speciesId, bucket);
    }
  }

  const allSpecies = [...speciesById.values()].sort((a, b) => a.nationalDexNumber - b.nationalDexNumber);
  const versionGroupById = new Map(versionRegistry.versionGroups.map((vg) => [vg.id, vg]));

  const regionsBySpeciesId = new Map<string, Set<Region>>();
  for (const species of allSpecies) {
    const regions = new Set<Region>();
    for (const versionGroupId of species.availability) {
      const vg = versionGroupById.get(versionGroupId);
      if (vg) regions.add(vg.region);
    }
    regionsBySpeciesId.set(species.id, regions);
  }

  const searchIndex = createSearchIndex(allSpecies);

  return {
    manifest,
    versionRegistry,
    allSpecies,
    search: (query) => searchIndex.search(query),
    getSpecies: (id) => speciesById.get(id),
    getSpeciesByDexNumber: (n) => speciesByDexNumber.get(n),
    getForm: (id) => formById.get(id),
    getFormsForSpecies: (speciesId) => formsBySpeciesId.get(speciesId) ?? [],
    getVersionGroup: (id) => versionGroupById.get(id),
    listSpecies: (filter) => filterSpecies(allSpecies, filter, { formsBySpeciesId, regionsBySpeciesId }),
  };
}
