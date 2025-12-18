"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

export const MultiSelectEditModePaginatedFormExample = () => {
  // Simulate receiving data from backend
  const initialSelectedIds = SIMULATED_BACKEND_DATA.multiSelect.selectedIds;
  const [isRequired, setIsRequired] = useState(false);

  const multiSelectFormSchema = z.object({
    selected: isRequired
      ? z.union([z.string(), z.array(z.string())]).refine(
          (val) => {
            if (typeof val === "string")
              return val === "__ALL__" || val.length > 0;
            return Array.isArray(val) && val.length > 0;
          },
          { message: "Please select at least one blogger" },
        )
      : z.union([z.string(), z.array(z.string())]),
    excluded: z.array(z.string()),
  });

  type MultiSelectFormData = z.infer<typeof multiSelectFormSchema>;

  const multiForm = useForm<MultiSelectFormData>({
    resolver: zodResolver(multiSelectFormSchema),
    defaultValues: {
      selected: initialSelectedIds,
      excluded: [],
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

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Multi Select - Edit Mode</h3>
      <form
        onSubmit={multiForm.handleSubmit((data) => {
          console.log("Multi form submitted:", data);
        })}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="required-toggle-2"
            checked={isRequired}
            onCheckedChange={setIsRequired}
          />
          <Label htmlFor="required-toggle-2" className="cursor-pointer">
            Required field
          </Label>
        </div>
        <div className="space-y-2">
          <Label>
            Select bloggers{" "}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Controller
            name="selected"
            control={multiForm.control}
            render={({ field, fieldState }) => (
              <Controller
                name="excluded"
                control={multiForm.control}
                render={({ field: excludedField }) => (
                  <div className="space-y-1">
                    <MultiAsyncSelect
                      async
                      loading={isPending || isFetchingMultiMissing}
                      error={error}
                      options={MULTI_OPTIONS}
                      value={field.value}
                      excluded={excludedField.value}
                      onValueChange={(value) => {
                        if (
                          value === "__ALL__" ||
                          (Array.isArray(value) && value[0] === "__ALL__")
                        ) {
                          field.onChange("__ALL__");
                          return;
                        }
                        field.onChange(value ?? []);
                      }}
                      onExcludedChange={excludedField.onChange}
                      onSearch={handleSearch}
                      placeholder="Select bloggers..."
                      multiple={true}
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
            onClick={() => multiForm.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
