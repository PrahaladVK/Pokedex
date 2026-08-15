import { z } from "zod";
import { PokemonTypeSchema } from "./constants";

// Open string, not a strict enum: PokeAPI has values beyond the obvious
// three (e.g. "full-moon" for Ursaluna). KNOWN_TIMES_OF_DAY covers the common ones.
export const TimeOfDaySchema = z.string();
export const KNOWN_TIMES_OF_DAY = ["day", "night", "dusk", "full-moon", "half-moon"] as const;
export const GenderSchema = z.enum(["male", "female"]);

// Fields on one condition are AND-ed (minLevel + timeOfDay both required).
// Multiple conditions in an edge's array are OR-ed alternatives.
const EvolutionConditionFieldsSchema = z.object({
  minLevel: z.number().int().positive().optional(),
  minHappiness: z.number().int().nonnegative().optional(),
  minAffection: z.number().int().nonnegative().optional(),
  minBeauty: z.number().int().nonnegative().optional(),
  timeOfDay: TimeOfDaySchema.optional(),
  heldItem: z.string().optional(),
  knownMove: z.string().optional(),
  knownMoveType: PokemonTypeSchema.optional(),
  location: z.string().optional(),
  gender: GenderSchema.optional(),
  partySpecies: z.string().optional(),
  partyType: PokemonTypeSchema.optional(),
  needsOverworldRain: z.boolean().optional(),
  turnUpsideDown: z.boolean().optional(),
  /** -1 = attack < defense, 0 = equal, 1 = attack > defense (e.g. Tyrogue) */
  relativePhysicalStats: z.union([z.literal(-1), z.literal(0), z.literal(1)]).optional(),
});

export const EvolutionConditionSchema = z.discriminatedUnion("trigger", [
  EvolutionConditionFieldsSchema.extend({ trigger: z.literal("level-up") }),
  EvolutionConditionFieldsSchema.extend({
    trigger: z.literal("trade"),
    tradeForSpecies: z.string().optional(),
  }),
  EvolutionConditionFieldsSchema.extend({
    trigger: z.literal("use-item"),
    item: z.string(),
  }),
  EvolutionConditionFieldsSchema.extend({ trigger: z.literal("shed") }),
  // Escape hatch for mechanics that don't fit the shape above.
  EvolutionConditionFieldsSchema.extend({
    trigger: z.literal("other"),
    description: z.string(),
  }),
]);
export type EvolutionCondition = z.infer<typeof EvolutionConditionSchema>;

export const EvolutionEdgeSchema = z.object({
  fromSpeciesId: z.string(),
  toSpeciesId: z.string(),
  conditions: z.array(EvolutionConditionSchema).min(1),
});
export type EvolutionEdge = z.infer<typeof EvolutionEdgeSchema>;
