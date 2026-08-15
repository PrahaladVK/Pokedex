import type { EvolutionCondition, Species } from "@pokedex/schema";

export interface EvolutionChainNode {
  species: Species;
  /** Conditions required to reach this node from its parent; empty for the chain's root. */
  viaConditions: EvolutionCondition[];
  children: EvolutionChainNode[];
}

// Builds the full evolution tree containing speciesId, rooted at its
// earliest ancestor (asking for Ivysaur returns the whole Bulbasaur chain).
export function buildEvolutionChain(
  speciesId: string,
  getSpecies: (id: string) => Species | undefined,
): EvolutionChainNode | undefined {
  const start = getSpecies(speciesId);
  if (!start) return undefined;

  let root = start;
  const visited = new Set<string>([root.id]);
  while (root.evolvesFromSpeciesId) {
    const parent = getSpecies(root.evolvesFromSpeciesId);
    if (!parent || visited.has(parent.id)) break;
    visited.add(parent.id);
    root = parent;
  }

  function buildNode(species: Species, viaConditions: EvolutionCondition[], ancestry: Set<string>): EvolutionChainNode {
    const children: EvolutionChainNode[] = [];
    for (const edge of species.evolutions) {
      if (ancestry.has(edge.toSpeciesId)) continue; // guard against malformed cyclic data
      const childSpecies = getSpecies(edge.toSpeciesId);
      if (!childSpecies) continue;
      children.push(buildNode(childSpecies, edge.conditions, new Set(ancestry).add(edge.toSpeciesId)));
    }
    return { species, viaConditions, children };
  }

  return buildNode(root, [], new Set([root.id]));
}
