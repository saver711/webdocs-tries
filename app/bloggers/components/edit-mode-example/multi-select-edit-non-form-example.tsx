"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFetchMissingBloggers } from "./hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "./utils";

interface MultiSelectEditNonFormExampleProps {
  initialSelectedIds: string[];
}

export const MultiSelectEditNonFormExample = ({
  initialSelectedIds,
}: MultiSelectEditNonFormExampleProps) => {
  const [searchString, setSearchString] = useState("");
  const [selectedValues, setSelectedValues] =
    useState<string[]>(initialSelectedIds);
  const [excluded, setExcluded] = useState<string[]>([]);

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

  const handleValueChange = (value: string[] | string | undefined) => {
    // Handle async select all case (returns "__ALL__" string)
    if (typeof value === "string" && value === "__ALL__") {
      setSelectedValues([value]);
      return;
    }
    // Handle normal array case
    const newValue = Array.isArray(value) ? value : [];
    setSelectedValues(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select bloggers</Label>
        <MultiAsyncSelect
          async
          loading={isPending || isFetchingMissing}
          error={error}
          options={OPTIONS}
          value={selectedValues}
          excluded={excluded}
          onValueChange={handleValueChange}
          onExcludedChange={setExcluded}
          onSearch={handleSearch}
          placeholder="Select bloggers..."
          multiple={true}
          searchPlaceholder="Search bloggers..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-medium mb-1">Selected Values:</p>
        <code className="text-xs">
          {selectedValues.length > 0
            ? JSON.stringify(selectedValues, null, 2)
            : "None"}
        </code>
      </div>

      <Button
        onClick={() => {
          console.log("Multi select values:", selectedValues);
        }}
        variant="outline"
        size="sm"
      >
        Log Value
      </Button>
    </div>
  );
};

