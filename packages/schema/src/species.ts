import { z } from "zod";
import { GenerationIdSchema, PokemonTypeSchema } from "./constants";
import { AbilitySlotSchema, BaseStatsSchema } from "./stats";
import { EvolutionEdgeSchema } from "./evolution";

export const SpeciesSchema = z.object({
  id: z.string(),
  nationalDexNumber: z.number().int().positive(),
  name: z.string(),
  genus: z.string().optional(),
  generationId: GenerationIdSchema,
  defaultFormId: z.string(),
  formIds: z.array(z.string()).min(1),
  /** Convenience copy of the default form's types/stats, so list views don't need a form lookup. */
  types: z.array(PokemonTypeSchema).min(1).max(2),
  baseStats: BaseStatsSchema,
  abilities: z.array(AbilitySlotSchema),
  heightM: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  evolvesFromSpeciesId: z.string().optional(),
  evolutions: z.array(EvolutionEdgeSchema).default([]),
  /** Version group ids this species appears in. */
  availability: z.array(z.string()).default([]),
  /** Version group id -> Pokedex flavor text for that game. */
  flavorText: z.record(z.string(), z.string()).default({}),
});
export type Species = z.infer<typeof SpeciesSchema>;
