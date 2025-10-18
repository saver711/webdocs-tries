// app/bloggers/components/bloggers-table.tsx
"use client";

import { Trash2 } from "lucide-react";
import { DataTable } from "@/app/components/ui/table/data-table";
import { useTablePagination } from "@/app/components/ui/table/hooks/use-table-pagination";
import { useTableSorting } from "@/app/components/ui/table/hooks/use-table-sorting";
import { Button } from "@/components/ui/button";
import { useBloggersDeletion } from "../hooks/use-bloggers-deletion";
import type { Blogger } from "../models/blogger.model";
import { getBloggersTableColumns } from "../utils/get-bloggers-table-columns.util";
import { BloggersFilterBar } from "./bloggers-filter-bar";

interface BloggersTableProps {
  data: Blogger[];
}

export const BloggersTablex = ({ data }: BloggersTableProps) => {
  const { sorting, setSorting } = useTableSorting("sortx");
  const { pagination, setPagination } = useTablePagination(
    "pagex",
    "pageSizex",
  );
  const {
    filteredData,
    selectedBloggers,
    setSelectedBloggers,
    handleDelete,
    handleBulkDelete,
    setFilteredData,
  } = useBloggersDeletion(data);
  const columns = getBloggersTableColumns({ onDelete: handleDelete });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BloggersFilterBar data={data} onFilter={setFilteredData} />

        {selectedBloggers.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowSelectionChange={setSelectedBloggers}
        rowId="id"
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};
