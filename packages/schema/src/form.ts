import { z } from "zod";
import { PokemonTypeSchema } from "./constants";
import { AbilitySlotSchema, BaseStatsSchema, SpriteSetSchema } from "./stats";

export const FormCategorySchema = z.enum([
  "base",
  "regional-variant",
  "mega-evolution",
  "gigantamax",
  "primal-reversion",
  "other-gimmick",
]);
export type FormCategory = z.infer<typeof FormCategorySchema>;

export const RegionalVariantKindSchema = z.enum(["alolan", "galarian", "hisuian", "paldean"]);
export type RegionalVariantKind = z.infer<typeof RegionalVariantKindSchema>;

export const EvYieldSchema = z.object({
  hp: z.number().int().nonnegative().optional(),
  attack: z.number().int().nonnegative().optional(),
  defense: z.number().int().nonnegative().optional(),
  specialAttack: z.number().int().nonnegative().optional(),
  specialDefense: z.number().int().nonnegative().optional(),
  speed: z.number().int().nonnegative().optional(),
});
export type EvYield = z.infer<typeof EvYieldSchema>;

// A distinct in-game presentation of a species: base form, regional variant,
// Mega, Gigantamax, Primal, or other gimmick. Every species has at least
// one form; Species.defaultFormId points to the base one.
export const FormSchema = z.object({
  id: z.string(),
  speciesId: z.string(),
  name: z.string(),
  category: FormCategorySchema,
  regionalVariantKind: RegionalVariantKindSchema.optional(),
  types: z.array(PokemonTypeSchema).min(1).max(2),
  abilities: z.array(AbilitySlotSchema),
  baseStats: BaseStatsSchema,
  evYield: EvYieldSchema.default({}),
  introducedIn: z.string().optional(),
  isDefault: z.boolean().default(false),
  sprites: SpriteSetSchema.default({}),
  /** Version-group id -> sprite set, for games with distinct sprite art. */
  spritesByVersionGroup: z.record(z.string(), SpriteSetSchema).default({}),
});
export type Form = z.infer<typeof FormSchema>;
