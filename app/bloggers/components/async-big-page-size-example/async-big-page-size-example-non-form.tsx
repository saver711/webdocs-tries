"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import type { Blogger } from "@/app/bloggers/models/blogger.model";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Large page size to get all data at once
const LARGE_PAGE_SIZE = 1000;

export const AsyncBigPageSizeExampleNonForm = () => {
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

  // Fetch all bloggers once with large page size
  const { isPending, data, error } = useQuery({
    queryKey: ["bloggers-all"],
    queryFn: async () => {
      return await fetchBloggers({
        perPage: LARGE_PAGE_SIZE,
      });
    },
  });

  const OPTIONS =
    data?.data.map((blogger: Blogger) => ({
      label: (
        <div className="flex items-center gap-2">
          {blogger.image && (
            <Image
              src={blogger.image}
              alt={blogger.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>{blogger.name}</span>
        </div>
      ),
      value: blogger._id,
    })) || [];

  const handleSubmit = () => {
    const data = {
      multiSelect: multiSelectValue,
    };
    console.log("Data submitted:", data);
  };

  const handleReset = () => {
    setMultiSelectValue([]);
  };

  return (
    <div className="space-y-6">
      {/* Multi Select */}
      <div className="space-y-2">
        <Label>Multi Select</Label>
        <MultiAsyncSelect
          options={OPTIONS}
          loading={isPending}
          error={error}
          multiple={true}
          placeholder="Select bloggers..."
          value={multiSelectValue}
          onValueChange={(value) => {
            const newValue = Array.isArray(value) ? value : [];
            setMultiSelectValue(newValue);
          }}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Display values */}
      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Selected Values:</h4>
        <pre className="text-sm">
          {JSON.stringify(
            {
              multiSelect: multiSelectValue,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
};
