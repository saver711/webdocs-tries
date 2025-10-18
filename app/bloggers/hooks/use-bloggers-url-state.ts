// app/bloggers/hooks/use-bloggers-url-state.ts
"use client"

import { parseAsString, useQueryStates } from "nuqs"
export const bloggersUrlStateSchema = {
  name: parseAsString.withDefault(""),
  bio: parseAsString.withDefault(""),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault("")
}

// type BloggersUrlState = inferParserType<typeof bloggersUrlStateSchema>

export const useBloggersUrlState = () =>
  useQueryStates(bloggersUrlStateSchema, {
    history: "replace"
  })

// export const serializeBloggersUrl = createSerializer(bloggersUrlStateSchema)
