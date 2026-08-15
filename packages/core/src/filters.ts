import type { FormCategory, GenerationId, PokemonType, Region, Species, Form } from "@pokedex/schema";

export interface SpeciesFilter {
  generationId?: GenerationId;
  type?: PokemonType;
  region?: Region;
  hasFormCategory?: FormCategory;
}

export interface FilterContext {
  formsBySpeciesId: Map<string, Form[]>;
  regionsBySpeciesId: Map<string, Set<Region>>;
}

export function matchesFilter(species: Species, filter: SpeciesFilter, ctx: FilterContext): boolean {
  if (filter.generationId && species.generationId !== filter.generationId) return false;
  if (filter.type && !species.types.includes(filter.type)) return false;
  if (filter.region) {
    const regions = ctx.regionsBySpeciesId.get(species.id);
    if (!regions?.has(filter.region)) return false;
  }
  if (filter.hasFormCategory) {
    const forms = ctx.formsBySpeciesId.get(species.id) ?? [];
    if (!forms.some((f) => f.category === filter.hasFormCategory)) return false;
  }
  return true;
}

export function filterSpecies(species: Species[], filter: SpeciesFilter | undefined, ctx: FilterContext): Species[] {
  if (!filter) return species;
  return species.filter((s) => matchesFilter(s, filter, ctx));
}
