// app/components/ui/table/hooks/use-table-url-state.ts
"use client";

import { parseAsInteger, useQueryStates } from "nuqs";
import { DEFAULT_TABLE_PAGE_INDEX_VALUE } from "../consts/default-table-page-index-value.const";
import { DEFAULT_TABLE_PER_PAGE_VALUE } from "../consts/default-table-per-page-value.const";
import { pageParser } from "../utils/page-parser.util";
import { sortParser } from "../utils/sort-parser.util";

const tableUrlStateSchema = ({
  sortParamName = "sort",
  pageParamName = "page",
  pageSizeParamName = "pageSize",
}) => ({
  [pageParamName]: pageParser.withDefault(DEFAULT_TABLE_PAGE_INDEX_VALUE),
  [pageSizeParamName]: parseAsInteger.withDefault(DEFAULT_TABLE_PER_PAGE_VALUE),
  [sortParamName]: sortParser.withDefault([]),
});

/**
 * Syncs common table state (page, pageSize, sort) with the URL using nuqs.
 *
 * Useful when you want table pagination & sorting to be:
 * - Shareable via URL
 * - Restored on refresh / navigation
 *
 * @param {Object} params
 * @param {string} [params.sortParamName="sort"] - Query param name for sort configuration.
 * @param {string} [params.pageParamName="page"] - Query param name for current page index.
 * @param {string} [params.pageSizeParamName="pageSize"] - Query param name for page size.
 * @returns {ReturnType<typeof useQueryStates>} nuqs state + setter bound to the given params.
 */
// changed: focused & expanded JSDoc for exported hook
export const useTableUrlState = ({
  sortParamName = "sort",
  pageParamName = "page",
  pageSizeParamName = "pageSize",
}) =>
  useQueryStates(
    tableUrlStateSchema({
      sortParamName,
      pageParamName,
      pageSizeParamName,
    }),
    {
      history: "replace",
    },
  );
