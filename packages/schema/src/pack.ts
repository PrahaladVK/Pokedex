import { z } from "zod";
import { GenerationIdSchema } from "./constants";
import { SpeciesSchema } from "./species";
import { FormSchema } from "./form";

export const GenerationPackMetaSchema = z.object({
  id: GenerationIdSchema,
  schemaVersion: z.number().int().positive(),
  /** Free-form data version, e.g. a date stamp: "2026.08.16". Bump on any content change. */
  dataVersion: z.string(),
  sourceUpdatedAt: z.string().optional(),
  /** "partial" packs (e.g. an unreleased/newly-released game) render fine but are known-incomplete. */
  status: z.enum(["complete", "partial"]),
});
export type GenerationPackMeta = z.infer<typeof GenerationPackMetaSchema>;

export const GenerationPackSchema = z.object({
  meta: GenerationPackMetaSchema,
  species: z.array(SpeciesSchema),
  forms: z.array(FormSchema),
});
export type GenerationPack = z.infer<typeof GenerationPackSchema>;

export const ManifestEntrySchema = GenerationPackMetaSchema.extend({
  file: z.string(),
});
export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export const ManifestSchema = z.object({
  schemaVersion: z.number().int().positive(),
  packs: z.array(ManifestEntrySchema),
});
export type Manifest = z.infer<typeof ManifestSchema>;
