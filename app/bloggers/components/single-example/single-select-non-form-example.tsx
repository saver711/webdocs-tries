"use client";

import { useState } from "react";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SingleSelectNonFormExampleProps {
  options: Option[];
}

export const SingleSelectNonFormExample = ({
  options,
}: SingleSelectNonFormExampleProps) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select a framework</Label>
        <MultiAsyncSelect
          options={options}
          value={selectedValue}
          onValueChange={(value) => {
            const newValue = typeof value === "string" ? value : undefined;
            setSelectedValue(newValue);
          }}
          placeholder="Select a framework..."
          multiple={false}
        />
      </div>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-medium mb-1">Selected:</p>
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
