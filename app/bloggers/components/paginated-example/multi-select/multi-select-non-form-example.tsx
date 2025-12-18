"use client";

import { useState } from "react";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Label } from "@/components/ui/label";
import { usePaginatedBloggers } from "../use-paginated-bloggers";

export const MultiSelectPaginatedNonFormExample = () => {
  const [multiSelectedValues, setMultiSelectedValues] = useState<
    string[] | string
  >([]);
  const [multiExcluded, setMultiExcluded] = useState<string[]>([]);

  const {
    OPTIONS,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
  } = usePaginatedBloggers("bloggers-paginated");

  const handleMultiValueChange = (value: string[] | string | undefined) => {
    if (
      value === "__ALL__" ||
      (Array.isArray(value) && value[0] === "__ALL__")
    ) {
      setMultiSelectedValues("__ALL__");
      return;
    }
    setMultiSelectedValues(value ?? []);
  };

  const handleMultiExcludedChange = (excludedItems: string[]) => {
    setMultiExcluded(excludedItems);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Multi Select</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select bloggers</Label>
          <MultiAsyncSelect
            async
            loading={isPending}
            error={error}
            options={OPTIONS}
            value={multiSelectedValues}
            excluded={multiExcluded}
            onValueChange={handleMultiValueChange}
            onExcludedChange={handleMultiExcludedChange}
            onSearch={handleSearch}
            placeholder="Select bloggers..."
            multiple={true}
            searchPlaceholder="Search bloggers..."
            onLoadMore={handleLoadMore}
              hasMore={hasNextPage}
              isLoadingMore={isFetchingNextPage}
            clearSearchOnClose={true}
          />
        </div>
        <div className="p-3 bg-muted rounded-md space-y-2">
          <div>
            <p className="text-sm font-medium mb-1">Selected Values:</p>
            <code className="text-xs">
              {(() => {
                if (
                  typeof multiSelectedValues === "string" &&
                  multiSelectedValues === "__ALL__"
                ) {
                  return "__ALL__";
                }
                if (
                  Array.isArray(multiSelectedValues) &&
                  multiSelectedValues.length > 0
                ) {
                  return JSON.stringify(multiSelectedValues, null, 2);
                }
                return "None";
              })()}
            </code>
          </div>
          {typeof multiSelectedValues === "string" &&
            multiSelectedValues === "__ALL__" &&
            multiExcluded.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Excluded Items:</p>
                <code className="text-xs">
                  {JSON.stringify(multiExcluded, null, 2)}
                </code>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

