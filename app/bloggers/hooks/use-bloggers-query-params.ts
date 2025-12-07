// app/bloggers/hooks/use-bloggers-query-params.ts

import { DEFAULT_TABLE_PAGE_INDEX_VALUE } from "@/app/components/ui/table/consts/default-table-page-index-value.const";
import { DEFAULT_TABLE_PER_PAGE_VALUE } from "@/app/components/ui/table/consts/default-table-per-page-value.const";
import { useTablePagination } from "@/app/components/ui/table/hooks/use-table-pagination";
import { useTableSorting } from "@/app/components/ui/table/hooks/use-table-sorting";
import { SortOrder } from "@/app/models/api.model";
import type { BloggersTableParams } from "../models/blogger.model";
import { useBloggersUrlState } from "./use-bloggers-url-state";

export const useBloggersQueryParams = () => {
  const { sorting, setSorting } = useTableSorting();
  const { pagination, setPagination } = useTablePagination();
  const [{ name, bio, dateFrom, dateTo }] = useBloggersUrlState();

  const sortItem = sorting?.[0];
  const sortBy = sortItem?.id;
  let sortOrder: SortOrder | undefined;

  if (sortBy) {
    sortOrder = sortItem?.desc ? SortOrder.DESC : SortOrder.ASC;
  }

  const fetchBloggersParams: BloggersTableParams = {
    page: pagination.pageIndex + 1 || DEFAULT_TABLE_PAGE_INDEX_VALUE + 1,
    perPage: pagination.pageSize || DEFAULT_TABLE_PER_PAGE_VALUE,
    sortBy,
    sortOrder,
    name,
    bio,
    dateFrom,
    dateTo,
  };

  return {
    sorting,
    setSorting,
    pagination,
    setPagination,
    fetchBloggersParams,
  };
};
