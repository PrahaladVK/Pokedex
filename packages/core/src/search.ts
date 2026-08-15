import Fuse from "fuse.js";
import type { Species } from "@pokedex/schema";

export interface SearchIndex {
  search(query: string): Species[];
}

export function createSearchIndex(species: Species[]): SearchIndex {
  const fuse = new Fuse(species, {
    keys: [
      { name: "name", weight: 0.8 },
      { name: "nationalDexNumber", weight: 0.2 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
  });

  return {
    search(query: string) {
      const trimmed = query.trim();
      if (!trimmed) return species;
      return fuse.search(trimmed).map((result) => result.item);
    },
  };
}
