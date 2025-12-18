"use client";

import { useState } from "react";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Label } from "@/components/ui/label";
import { usePaginatedBloggers } from "../use-paginated-bloggers";

export const SingleSelectPaginatedNonFormExample = () => {
  const [singleSelectedValue, setSingleSelectedValue] = useState<
    string | undefined
  >(undefined);

  const {
    OPTIONS,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
  } = usePaginatedBloggers("bloggers-paginated");

  const handleSingleValueChange = (value: string[] | string | undefined) => {
    if (Array.isArray(value)) {
      setSingleSelectedValue(value[0]);
    } else {
      setSingleSelectedValue(value);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Single Select</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select a blogger</Label>
          <MultiAsyncSelect
            async
            loading={isPending}
            error={error}
            options={OPTIONS}
            value={singleSelectedValue}
            onValueChange={handleSingleValueChange}
            onSearch={handleSearch}
            placeholder="Select a blogger..."
            multiple={false}
            searchPlaceholder="Search bloggers..."
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
            clearSearchOnClose={true}
          />
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-1">Selected Value:</p>
          <code className="text-xs">{singleSelectedValue || "None"}</code>
        </div>
      </div>
    </div>
  );
};

