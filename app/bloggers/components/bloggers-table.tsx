// app/bloggers/components/bloggers-table.tsx
"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/app/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import type { Blogger } from "../models/blogger.model";
import { getBloggersTableColumns } from "../utils/get-bloggers-table-columns.util";
import { BloggersFilterBar } from "./bloggers-filter-bar";

interface BloggersTableProps {
  data: Blogger[];
}

export const BloggersTable = ({ data }: BloggersTableProps) => {
  const [filteredData, setFilteredData] = useState<Blogger[]>(data);
  const [selectedBloggers, setSelectedBloggers] = useState<Blogger[]>([]);
  console.log("Selected Bloggers:", selectedBloggers);

  const handleDelete = (id: string) => {
    setFilteredData((prev) => prev.filter((blogger) => blogger.id !== id));
  };

  const handleBulkDelete = () => {
    // Perform bulk delete operation
    const selectedIds = selectedBloggers.map((blogger) => blogger.id);
    setFilteredData((prev) =>
      prev.filter((blogger) => !selectedIds.includes(blogger.id)),
    );
    setSelectedBloggers([]); // Clear selection after deletion
  };

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
      />
    </div>
  );
};
