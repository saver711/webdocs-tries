"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SIMULATED_BACKEND_DATA } from "../../../edit-mode-example/constants";
import { useFetchMissingBloggers } from "../../../edit-mode-example/hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "../../../edit-mode-example/utils";
import { usePaginatedBloggers } from "../../use-paginated-bloggers";

export const SingleSelectEditModePaginatedFormExample = () => {
  // Simulate receiving data from backend
  const initialSelectedId = SIMULATED_BACKEND_DATA.singleSelect.selectedId;
  const [isRequired, setIsRequired] = useState(false);

  const singleSelectFormSchema = z.object({
    selected: isRequired
      ? z.string("Please select a blogger").min(1, "Please select a blogger")
      : z.string().nullable().optional(),
  });

  type SingleSelectFormData = z.infer<typeof singleSelectFormSchema>;

  const singleForm = useForm<SingleSelectFormData>({
    resolver: zodResolver(singleSelectFormSchema),
    defaultValues: {
      selected: undefined, // Default to undefined so clearing actually clears
    },
  });

  // Set initial value after form is created (not as defaultValue)
  React.useEffect(() => {
    if (initialSelectedId) {
      singleForm.setValue("selected", initialSelectedId);
    }
  }, [initialSelectedId, singleForm]);

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

  // Single select: watch current form value to fetch missing blogger if needed
  const currentSelectedId = singleForm.watch("selected");
  const selectedIdsForSingle = currentSelectedId ? [currentSelectedId] : [];
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
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="required-toggle-1"
            checked={isRequired}
            onCheckedChange={setIsRequired}
          />
          <Label htmlFor="required-toggle-1" className="cursor-pointer">
            Required field
          </Label>
        </div>
        <div className="space-y-2">
          <Label>
            Select a blogger{" "}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Controller
            name="selected"
            control={singleForm.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <MultiAsyncSelect
                  async
                  loading={isPending || isFetchingSingleMissing}
                  error={error}
                  options={SINGLE_OPTIONS}
                  value={field.value ?? undefined}
                  onValueChange={(value) => {
                    // Use null for cleared state (not undefined) to prevent reverting to defaultValues
                    if (Array.isArray(value)) {
                      field.onChange(value[0] ?? null);
                    } else {
                      field.onChange(value === undefined ? null : value);
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
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
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
