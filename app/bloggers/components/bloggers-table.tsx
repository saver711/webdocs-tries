// app/bloggers/components/bloggers-table.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/app/components/ui/table/data-table";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { useBloggersQueryParams } from "../hooks/use-bloggers-query-params";
import { useDeleteBloggers } from "../hooks/use-delete-bloggers";
import { getBloggersTableColumns } from "../utils/get-bloggers-table-columns.util";
import { BloggersFilterBar } from "./bloggers-filter-bar";

export const BloggersTable = () => {
  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    fetchBloggersParams,
  } = useBloggersQueryParams();

  const {
    data: bloggersResponse,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bloggers", fetchBloggersParams],
    queryFn: () => fetchBloggers(fetchBloggersParams),
  });

  const data = bloggersResponse?.data;

  const { selectedBloggers, setSelectedBloggers, deleteBloggers } =
    useDeleteBloggers({
      pagination,
      setPagination,
      currentDataLength: data?.length,
    });
  const pageCount = bloggersResponse?.pagination.pageCount;
  const columns = getBloggersTableColumns({ onDelete: deleteBloggers });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <BloggersFilterBar />
        </div>

        {selectedBloggers.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteBloggers(selectedBloggers.map((b) => b._id))}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        onRowSelectionChange={setSelectedBloggers}
        rowId="_id"
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        pageCount={pageCount ?? 1}
        setPagination={setPagination}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
};
