import { z } from "zod";

// One entry per data pack. Legends Z-A gets its own id instead of folding
// into gen9 since it ships on its own timeline, independent of Scarlet/Violet.
export const GENERATION_IDS = [
  "gen1",
  "gen2",
  "gen3",
  "gen4",
  "gen5",
  "gen6",
  "gen7",
  "gen8",
  "gen9",
  "legends-za",
] as const;

export const GenerationIdSchema = z.enum(GENERATION_IDS);
export type GenerationId = z.infer<typeof GenerationIdSchema>;

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
  "stellar",
] as const;

export const PokemonTypeSchema = z.enum(POKEMON_TYPES);
export type PokemonType = z.infer<typeof PokemonTypeSchema>;

export const REGIONS = [
  "kanto",
  "johto",
  "hoenn",
  "sinnoh",
  "unova",
  "kalos",
  "alola",
  "galar",
  "hisui",
  "paldea",
] as const;

export const RegionSchema = z.enum(REGIONS);
export type Region = z.infer<typeof RegionSchema>;
