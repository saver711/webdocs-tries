"use client";

import { useState } from "react";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Label } from "@/components/ui/label";
import { SIMULATED_BACKEND_DATA } from "../../../edit-mode-example/constants";
import { useFetchMissingBloggers } from "../../../edit-mode-example/hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "../../../edit-mode-example/utils";
import { usePaginatedBloggers } from "../../use-paginated-bloggers";

export const SingleSelectEditModePaginatedNonFormExample = () => {
  // Simulate receiving data from backend
  const initialSelectedId = SIMULATED_BACKEND_DATA.singleSelect.selectedId;

  // Single select state
  const [singleSelectedValue, setSingleSelectedValue] = useState<
    string | null | undefined
  >(initialSelectedId);

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

  // Single select: use current selected value (not initial) to fetch missing blogger if needed
  const selectedIdsForSingle = singleSelectedValue ? [singleSelectedValue] : [];
  const {
    fetchedMissingOptions: singleFetchedMissingOptions,
    isFetchingMissing: isFetchingSingleMissing,
  } = useFetchMissingBloggers({
    selectedIds: selectedIdsForSingle,
    loadedOptionIds,
    searchString,
    isPending,
    data: data
      ? {
          data: data.pages.flatMap((page) => page.data),
        }
      : undefined,
  });

  // Merge options for single select
  const SINGLE_OPTIONS = mergeOptions(
    loadedOptions,
    singleFetchedMissingOptions,
    searchString,
  );

  const handleSingleValueChange = (value: string[] | string | undefined) => {
    // Use null for cleared state to maintain consistent behavior
    if (Array.isArray(value)) {
      setSingleSelectedValue(value[0] ?? null);
    } else {
      setSingleSelectedValue(value === undefined ? null : value);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Single Select - Edit Mode</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select a blogger</Label>
          <MultiAsyncSelect
            async
            loading={isPending || isFetchingSingleMissing}
            error={error}
          options={SINGLE_OPTIONS}
          value={singleSelectedValue ?? undefined}
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
