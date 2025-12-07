// app/components/ui/table/hooks/use-table-sorting.ts
import type { SortingState, Updater } from "@tanstack/react-table";
import { useTableUrlState } from "./use-table-url-state";

/** nuqs Hook for managing table sorting state via URL parameters */
// sortParamName: the name of the URL parameter to use for sorting (default: "sort") - Because multiple tables may exist on the same page
export const useTableSorting = (sortParamName = "sort") => {
  const [urlState, setUrlState] = useTableUrlState({
    sortParamName,
  });
  const sorting = urlState[sortParamName] as SortingState;

  const setSorting = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    setUrlState({ [sortParamName]: newSorting });
  };

  return { sorting, setSorting };
};
