"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIMULATED_BACKEND_DATA } from "../../../edit-mode-example/constants";
import { useFetchMissingBloggers } from "../../../edit-mode-example/hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "../../../edit-mode-example/utils";
import { usePaginatedBloggers } from "../../use-paginated-bloggers";

const singleSelectFormSchema = z.object({
  selected: z.string().optional(),
});

type SingleSelectFormData = z.infer<typeof singleSelectFormSchema>;

export const SingleSelectEditModePaginatedFormExample = () => {
  // Simulate receiving data from backend
  const initialSelectedId = SIMULATED_BACKEND_DATA.singleSelect.selectedId;

  const singleForm = useForm<SingleSelectFormData>({
    resolver: zodResolver(singleSelectFormSchema),
    defaultValues: {
      selected: initialSelectedId,
    },
  });

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

  // Single select: fetch missing blogger
  const selectedIdsForSingle = initialSelectedId ? [initialSelectedId] : [];
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

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Single Select - Edit Mode</h3>
      <form
        onSubmit={singleForm.handleSubmit((data) => {
          console.log("Single form submitted:", data);
        })}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>Select a blogger</Label>
          <Controller
            name="selected"
            control={singleForm.control}
            render={({ field }) => (
              <MultiAsyncSelect
                async
                loading={isPending || isFetchingSingleMissing}
                error={error}
                options={SINGLE_OPTIONS}
                value={field.value}
                onValueChange={(value) => {
                  if (Array.isArray(value)) {
                    field.onChange(value[0]);
                  } else {
                    field.onChange(value);
                  }
                }}
                onSearch={handleSearch}
                placeholder="Select a blogger..."
                multiple={false}
                searchPlaceholder="Search bloggers..."
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                clearSearchOnClose={true}
              />
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => singleForm.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
