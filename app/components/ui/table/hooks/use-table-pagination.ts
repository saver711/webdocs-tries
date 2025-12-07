// app/components/ui/table/hooks/use-table-pagination.ts
import type { PaginationState, Updater } from "@tanstack/react-table";
import { useTableUrlState } from "./use-table-url-state";

/** nuqs Hook for managing table pagination state via URL parameters */
export const useTablePagination = (page = "page", pageSize = "pageSize") => {
  const [urlState, setUrlState] = useTableUrlState({
    pageParamName: page,
    pageSizeParamName: pageSize,
  });
  const pagination = {
    pageIndex: urlState[page],
    pageSize: urlState[pageSize],
  } as PaginationState;

  const setPagination = (updater: Updater<PaginationState>) => {
    const newPagination =
      typeof updater === "function" ? updater(pagination) : updater;
    setUrlState({
      [page]: newPagination.pageIndex,
      [pageSize]: newPagination.pageSize,
    });
  };

  return { pagination, setPagination };
};
