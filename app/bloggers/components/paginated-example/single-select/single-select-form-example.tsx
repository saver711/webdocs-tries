"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePaginatedBloggers } from "../use-paginated-bloggers";

export const SingleSelectPaginatedFormExample = () => {
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
      selected: undefined,
    },
  });

  const {
    OPTIONS,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
  } = usePaginatedBloggers("bloggers-paginated");

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Single Select</h3>
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
                  loading={isPending}
                  error={error}
                  options={OPTIONS}
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
