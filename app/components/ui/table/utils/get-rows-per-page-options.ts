// app/components/ui/table/utils/get-rows-per-page-options.ts
import { DEFAULT_TABLE_PER_PAGE_OPTIONS } from "../consts/default-table-per-page-options.const"

// This function ensures that the current page size coming from the URL is always included
export const getRowsPerPageOptions = (extraPageSize: number) => {
  return DEFAULT_TABLE_PER_PAGE_OPTIONS.includes(extraPageSize)
    ? DEFAULT_TABLE_PER_PAGE_OPTIONS
    : [...DEFAULT_TABLE_PER_PAGE_OPTIONS, extraPageSize].sort((a, b) => a - b)
}
