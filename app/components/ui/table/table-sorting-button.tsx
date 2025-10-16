import type { Column } from "@tanstack/react-table";
import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortingButtonProps<TData> {
  column: Column<TData>;
  label: string;
}

export const TableSortingButton = <TData,>({
  column,
  label,
}: SortingButtonProps<TData>) => {
  const isSorted = column.getIsSorted();

  const getSortIcon = () => {
    switch (isSorted) {
      case "asc":
        return <SortAsc className="h-4 w-4 text-success-700" />;
      case "desc":
        return <SortDesc className="h-4 w-4 text-success-700" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  return (
    <Button
      className="flex w-full items-center gap-1"
      variant="ghost"
      onClick={() => {
        column.toggleSorting(isSorted === "asc");
      }}
    >
      {getSortIcon()}
      {label}
    </Button>
  );
};
