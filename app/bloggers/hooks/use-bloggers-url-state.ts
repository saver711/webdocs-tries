// app/bloggers/hooks/use-bloggers-url-state.ts
"use client";

import { type inferParserType, parseAsString, useQueryStates } from "nuqs";
export const bloggersUrlStateSchema = {
  name: parseAsString,
  bio: parseAsString,
  dateFrom: parseAsString,
  dateTo: parseAsString,
};

export type BloggersUrlState = inferParserType<typeof bloggersUrlStateSchema>;

export const useBloggersUrlState = () => useQueryStates(bloggersUrlStateSchema);

// export const serializeBloggersUrl = createSerializer(bloggersUrlStateSchema)
