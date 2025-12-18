"use client";

import { useQuery } from "@tanstack/react-query";
import { LucideAirplay, LucideAlarmClockCheck } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AsyncSelectAllNonFormExample = () => {
  const [searchString, setSearchString] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[] | string>([]);
  const [excluded, setExcluded] = useState<string[]>([]);

  const { isPending, data, error } = useQuery({
    queryKey: ["bloggers", searchString],
    queryFn: async () => {
      return await fetchBloggers({ name: searchString });
    },
  });

  const OPTIONS =
    data?.data.map((blogger) => ({
      label: blogger.name,
      value: blogger._id,
    })) || [];

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 100);

  const handleValueChange = (value: string[] | string | undefined) => {
    setSelectedValues(value ?? []);
  };

  const handleExcludedChange = (excludedItems: string[]) => {
    setExcluded(excludedItems);
  };

  // Check if all is selected
  const isAllSelected =
    typeof selectedValues === "string" && selectedValues === "__ALL__";

  return (
    <>
      <div
        className={cn(
          "border border-zinc-200 rounded-md dark:border-zinc-800 p-4",
        )}
      >
        <MultiAsyncSelect
          async
          loading={isPending}
          error={error}
          options={OPTIONS}
          value={selectedValues}
          excluded={excluded}
          onValueChange={handleValueChange}
          onExcludedChange={handleExcludedChange}
          onSearch={handleSearch}
          className="w-[480px]"
          searchPlaceholder="Search bloggers..."
          placeholder="Select bloggers..."
          maxCount={3}
          labelFunc={(option, isSelected, index) => (
            <div
              className={cn(
                "flex items-center gap-x-1",
                isSelected && "text-blue-500",
              )}
            >
              {index % 2 ? (
                <LucideAirplay className="scale-75" />
              ) : (
                <LucideAlarmClockCheck className="scale-75" />
              )}
              <span>{option.label}</span>
              <span className="text-xs text-gray-500">({option.value})</span>
            </div>
          )}
        />
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="break-all">
          <strong>Selected values:</strong>{" "}
          <code className="bg-muted px-1 py-0.5 rounded">
            {JSON.stringify(selectedValues)}
          </code>
        </p>
        {isAllSelected && excluded.length > 0 && (
          <p>
            <strong>Excluded items:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {JSON.stringify(excluded)}
            </code>
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          {isAllSelected
            ? `All selected${excluded.length > 0 ? ` (${excluded.length} excluded)` : ""}`
            : `${
                Array.isArray(selectedValues) ? selectedValues.length : 0
              } item(s) selected`}
        </p>
        <p className="text-xs">
          <strong>Try it:</strong> Click "Select all" to select all items, then
          unselect some items to see them added to the excluded array.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => console.log(selectedValues)}
        >
          Log form values
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => console.log(excluded)}
        >
          Log Excluded values
        </Button>
      </div>
    </>
  );
};
