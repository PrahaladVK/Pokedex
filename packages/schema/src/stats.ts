import { z } from "zod";

export const BaseStatsSchema = z.object({
  hp: z.number().int().nonnegative(),
  attack: z.number().int().nonnegative(),
  defense: z.number().int().nonnegative(),
  specialAttack: z.number().int().nonnegative(),
  specialDefense: z.number().int().nonnegative(),
  speed: z.number().int().nonnegative(),
});
export type BaseStats = z.infer<typeof BaseStatsSchema>;

export const AbilitySlotSchema = z.object({
  name: z.string(),
  isHidden: z.boolean().default(false),
  slot: z.number().int().positive(),
});
export type AbilitySlot = z.infer<typeof AbilitySlotSchema>;

export const SpriteSetSchema = z.object({
  front: z.string().url().optional(),
  frontShiny: z.string().url().optional(),
  official: z.string().url().optional(),
});
export type SpriteSet = z.infer<typeof SpriteSetSchema>;
