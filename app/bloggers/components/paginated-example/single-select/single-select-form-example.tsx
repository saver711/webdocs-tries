"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePaginatedBloggers } from "../use-paginated-bloggers";

const singleSelectFormSchema = z.object({
  selected: z.string().optional(),
});

type SingleSelectFormData = z.infer<typeof singleSelectFormSchema>;

export const SingleSelectPaginatedFormExample = () => {
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
        <div className="space-y-2">
          <Label>Select a blogger</Label>
          <Controller
            name="selected"
            control={singleForm.control}
            render={({ field }) => (
              <MultiAsyncSelect
                async
                loading={isPending}
                error={error}
                options={OPTIONS}
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
