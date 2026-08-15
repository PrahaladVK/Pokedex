import { z } from "zod";
import { GenerationIdSchema, PokemonTypeSchema } from "./constants";
import { AbilitySlotSchema, BaseStatsSchema } from "./stats";
import { EvolutionEdgeSchema } from "./evolution";

export const TrainingSchema = z.object({
  catchRate: z.number().int().min(0).max(255),
  baseFriendship: z.number().int().min(0).max(255),
  baseExperience: z.number().int().nonnegative().optional(),
  growthRate: z.string(),
});
export type Training = z.infer<typeof TrainingSchema>;

export const BreedingSchema = z.object({
  eggGroups: z.array(z.string()),
  /** PokeAPI's gender_rate: -1 = genderless, 0-8 = eighths female. */
  genderRate: z.number().int().min(-1).max(8),
  eggCycles: z.number().int().nonnegative().optional(),
});
export type Breeding = z.infer<typeof BreedingSchema>;

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
  training: TrainingSchema.optional(),
  breeding: BreedingSchema.optional(),
  /** PokeAPI's own pokedex name (e.g. "kanto", "kalos-central") -> local dex number, display-only. */
  regionalDexNumbers: z.record(z.string(), z.number().int().positive()).default({}),
});
export type Species = z.infer<typeof SpeciesSchema>;
