// app/components/ui/table/hooks/use-table-url-state.ts
"use client"

import { parseAsInteger, useQueryStates } from "nuqs"
import { DEFAULT_TABLE_PAGE_INDEX_VALUE } from "@/app/components/ui/table/consts/default-table-page-index-value.const"
import { DEFAULT_TABLE_PER_PAGE_VALUE } from "@/app/components/ui/table/consts/default-table-per-page-value.const"
import { sortParser } from "@/app/components/ui/table/utils/sort-parser.util"
import { pageParser } from "../utils/page-parser.util"

const tableUrlStateSchema = ({
  sortParamName = "sort",
  pageParamName = "page",
  pageSizeParamName = "pageSize"
}) => ({
  [pageParamName]: pageParser.withDefault(DEFAULT_TABLE_PAGE_INDEX_VALUE),
  [pageSizeParamName]: parseAsInteger.withDefault(DEFAULT_TABLE_PER_PAGE_VALUE),
  [sortParamName]: sortParser.withDefault([])
})

/** nuqs Hook for common table url states (page, perPage, sort) */
export const useTableUrlState = ({
  sortParamName = "sort",
  pageParamName = "page",
  pageSizeParamName = "pageSize"
}) =>
  useQueryStates(
    tableUrlStateSchema({
      sortParamName,
      pageParamName,
      pageSizeParamName
    }),
    {
      history: "replace"
    }
  )
