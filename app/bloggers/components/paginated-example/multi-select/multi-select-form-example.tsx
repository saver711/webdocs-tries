"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePaginatedBloggers } from "../use-paginated-bloggers";

const multiSelectFormSchema = z.object({
  selected: z.union([z.string(), z.array(z.string())]),
  excluded: z.array(z.string()),
});

type MultiSelectFormData = z.infer<typeof multiSelectFormSchema>;

export const MultiSelectPaginatedFormExample = () => {
  const multiForm = useForm<MultiSelectFormData>({
    resolver: zodResolver(multiSelectFormSchema),
    defaultValues: {
      selected: [],
      excluded: [],
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
      <h3 className="text-lg font-medium">Multi Select</h3>
      <form
        onSubmit={multiForm.handleSubmit((data) => {
          console.log("Multi form submitted:", data);
        })}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>Select bloggers</Label>
          <Controller
            name="selected"
            control={multiForm.control}
            render={({ field }) => (
              <Controller
                name="excluded"
                control={multiForm.control}
                render={({ field: excludedField }) => (
                  <MultiAsyncSelect
                    async
                    loading={isPending}
                    error={error}
                    options={OPTIONS}
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
