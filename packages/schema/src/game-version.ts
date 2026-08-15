import { z } from "zod";
import { GenerationIdSchema, RegionSchema } from "./constants";

// A version group is a released pairing or single title, e.g. "red-blue" or
// "legends-za". Flavor text and sprites are keyed per version group so the
// app can show "as described in Sword" vs "as described in Legends Z-A".
export const VersionGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  generationId: GenerationIdSchema,
  region: RegionSchema,
  games: z.array(z.string()).min(1),
  releaseDate: z.string().optional(),
});
export type VersionGroup = z.infer<typeof VersionGroupSchema>;

export const GameVersionRegistrySchema = z.object({
  schemaVersion: z.number().int().positive(),
  versionGroups: z.array(VersionGroupSchema),
});
export type GameVersionRegistry = z.infer<typeof GameVersionRegistrySchema>;
