"use client";

import { useState } from "react";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectAllExample2NonFormProps {
  options: Option[];
}

export const SelectAllExample2NonForm = ({
  options,
}: SelectAllExample2NonFormProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <>
      <div
        className={cn(
          "border border-zinc-200 rounded-md dark:border-zinc-800 p-4",
        )}
      >
        <MultiAsyncSelect
          options={options}
          value={selectedValues}
          onValueChange={(value) => setSelectedValues(value as string[])}
          className="w-[480px]"
          searchPlaceholder="Search options (then select all)..."
          placeholder="Select options..."
          maxCount={3}
          clearSearchOnClose={false}
        />
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        Selected: {selectedValues.length} item(s)
        <Button
          className="cursor-pointer"
          onClick={() => console.log(selectedValues)}
          variant="outline"
        >
          Log selected values
        </Button>
      </div>
    </>
  );
};
