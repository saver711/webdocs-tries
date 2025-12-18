"use client";

import { useState } from "react";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Label } from "@/components/ui/label";
import { SIMULATED_BACKEND_DATA } from "../../../edit-mode-example/constants";
import { useFetchMissingBloggers } from "../../../edit-mode-example/hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "../../../edit-mode-example/utils";
import { usePaginatedBloggers } from "../../use-paginated-bloggers";

export const MultiSelectEditModePaginatedNonFormExample = () => {
  // Simulate receiving data from backend
  const initialSelectedIds = SIMULATED_BACKEND_DATA.multiSelect.selectedIds;

  // Multi select state
  const [multiSelectedValues, setMultiSelectedValues] = useState<
    string[] | string
  >(initialSelectedIds);
  const [multiExcluded, setMultiExcluded] = useState<string[]>([]);

  const {
    OPTIONS: loadedOptions,
    data,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
    searchString,
    loadedOptionIds,
  } = usePaginatedBloggers("bloggers-paginated-edit");

  // Multi select: fetch missing bloggers
  const {
    fetchedMissingOptions: multiFetchedMissingOptions,
    isFetchingMissing: isFetchingMultiMissing,
  } = useFetchMissingBloggers({
    selectedIds: initialSelectedIds,
    loadedOptionIds,
    searchString,
    isPending,
    data: data
      ? {
          data: data.pages.flatMap((page) => page.data),
        }
      : undefined,
  });

  // Merge options for multi select
  const MULTI_OPTIONS = mergeOptions(
    loadedOptions,
    multiFetchedMissingOptions,
    searchString,
  );

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
      <h3 className="text-lg font-medium">Multi Select - Edit Mode</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select bloggers</Label>
          <MultiAsyncSelect
            async
            loading={isPending || isFetchingMultiMissing}
            error={error}
            options={MULTI_OPTIONS}
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
