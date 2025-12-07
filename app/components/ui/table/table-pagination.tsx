import type { Table } from "@tanstack/react-table";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_TABLE_PER_PAGE_OPTIONS } from "./consts/default-table-per-page-options.const";

type TablePaginationProps<TData> = {
  table: Table<TData>;
};

export const TablePagination = <TData,>({
  table,
}: TablePaginationProps<TData>) => {
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // const perPageOptions = getRowsPerPageOptions(pageSize);
  const perPageOptions = DEFAULT_TABLE_PER_PAGE_OPTIONS; // [2, 5, 10, 20, 30, 40, 50]

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-auto">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {perPageOptions.map((pageSize) => (
              <SelectItem
                className="cursor-pointer"
                key={pageSize}
                value={`${pageSize}`}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-center text-sm font-medium">
        Page{" "}
        {pageIndex + 1 > table.getPageCount()
          ? table.getPageCount()
          : pageIndex + 1}{" "}
        of {table.getPageCount()}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPreviousPage || pageIndex + 1 > table.getPageCount()}
        >
          <span className="sr-only">Go to first page</span>
          <ArrowLeftCircleIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage || pageIndex + 1 > table.getPageCount()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!canNextPage}
        >
          <span className="sr-only">Go to last page</span>
          <ArrowRightCircleIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
