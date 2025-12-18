import { z } from "zod";

export const singleSelectSchema = z.object({
  selected: z.string().nullable().optional(),
});

export const multiSelectSchema = z.object({
  selected: z.union([z.string(), z.array(z.string())]),
  excluded: z.array(z.string()),
});

export type SingleSelectForm = z.infer<typeof singleSelectSchema>;
export type MultiSelectForm = z.infer<typeof multiSelectSchema>;
