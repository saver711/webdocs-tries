"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import UserAvatar from "@/assets/user.webp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFetchMissingBloggers } from "./hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "./utils";

interface SingleSelectEditNonFormExampleProps {
  initialSelectedId: string;
}

export const SingleSelectEditNonFormExample = ({
  initialSelectedId,
}: SingleSelectEditNonFormExampleProps) => {
  const [searchString, setSearchString] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null | undefined>(
    initialSelectedId,
  );

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

  // Use current selected value (not initial) to fetch missing blogger if needed
  const selectedIds = selectedValue ? [selectedValue] : [];

  const { fetchedMissingOptions, isFetchingMissing } = useFetchMissingBloggers({
    selectedIds,
    loadedOptionIds,
    searchString,
    isPending,
    data,
  });

  // Prepare options
  const loadedOptions: Option[] =
    data?.data.map((blogger) => ({
      label: (
        <div className="flex items-center gap-x-1">
          <Image
            src={blogger.image || UserAvatar}
            alt={blogger.name}
            width={20}
            height={20}
          />
          <span>{blogger.name}</span>
        </div>
      ),
      value: blogger._id,
    })) || [];

  const OPTIONS = mergeOptions(
    loadedOptions,
    fetchedMissingOptions,
    searchString,
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 100);

  const handleValueChange = (value: string | string[] | undefined) => {
    // Use null for cleared state to maintain consistent behavior
    const newValue = typeof value === "string" ? value : null;
    setSelectedValue(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select a blogger</Label>
        <MultiAsyncSelect
          async
          loading={isPending || isFetchingMissing}
          error={error}
          options={OPTIONS}
          value={selectedValue ?? undefined}
          onValueChange={handleValueChange}
          onSearch={handleSearch}
          placeholder="Select a blogger..."
          multiple={false}
          searchPlaceholder="Search bloggers..."
        />
      </div>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-medium mb-1">Selected Value:</p>
        <code className="text-xs">
          {selectedValue ? JSON.stringify(selectedValue, null, 2) : "None"}
        </code>
      </div>

      <Button
        onClick={() => {
          console.log("Single select value:", selectedValue);
        }}
        variant="outline"
        size="sm"
      >
        Log Value
      </Button>
    </div>
  );
};
