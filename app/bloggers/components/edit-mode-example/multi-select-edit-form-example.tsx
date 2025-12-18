"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFetchMissingBloggers } from "./hooks/use-fetch-missing-bloggers";
import { multiSelectSchema, type MultiSelectForm } from "./types";
import { mergeOptions } from "./utils";

interface MultiSelectEditFormExampleProps {
  initialSelectedIds: string[];
}

export const MultiSelectEditFormExample = ({
  initialSelectedIds,
}: MultiSelectEditFormExampleProps) => {
  const [searchString, setSearchString] = useState("");

  const form = useForm<MultiSelectForm>({
    resolver: zodResolver(multiSelectSchema),
    defaultValues: {
      selected: initialSelectedIds,
      excluded: [],
    },
  });

  // Fetch all bloggers for the dropdown
  const { isPending, data, error } = useQuery({
    queryKey: ["bloggers", searchString],
    queryFn: async () => {
      return await fetchBloggers({ name: searchString });
    },
  });

  const loadedOptionIds = new Set(
    data?.data.map((blogger) => blogger._id) || [],
  );

  const { fetchedMissingOptions, isFetchingMissing } = useFetchMissingBloggers({
    selectedIds: initialSelectedIds,
    loadedOptionIds,
    searchString,
    isPending,
    data,
  });

  // Prepare options
  const loadedOptions: Option[] =
    data?.data.map((blogger) => ({
      label: blogger.name,
      value: blogger._id,
    })) || [];

  const OPTIONS = mergeOptions(loadedOptions, fetchedMissingOptions, searchString);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 100);

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log("Form submitted:", data);
      })}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Select bloggers</Label>
        <Controller
          name="selected"
          control={form.control}
          render={({ field }) => (
            <Controller
              name="excluded"
              control={form.control}
              render={({ field: excludedField }) => (
                <MultiAsyncSelect
                  async
                  loading={isPending || isFetchingMissing}
                  error={error}
                  options={OPTIONS}
                  value={field.value}
                  excluded={excludedField.value}
                  onValueChange={(value) => {
                    // Handle async select all case (returns "__ALL__" string)
                    if (value === "__ALL__") {
                      field.onChange(value);
                      return;
                    }
                    // Handle normal array case
                    const newValue = Array.isArray(value) ? value : [];
                    field.onChange(newValue);
                  }}
                  onExcludedChange={excludedField.onChange}
                  onSearch={handleSearch}
                  placeholder="Select bloggers..."
                  multiple={true}
                  searchPlaceholder="Search bloggers..."
                />
              )}
            />
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Submit Form
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

