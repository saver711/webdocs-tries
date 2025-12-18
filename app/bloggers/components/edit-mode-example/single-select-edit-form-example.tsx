"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
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
import { type SingleSelectForm, singleSelectSchema } from "./types";
import { mergeOptions } from "./utils";

interface SingleSelectEditFormExampleProps {
  initialSelectedId: string;
}

export const SingleSelectEditFormExample = ({
  initialSelectedId,
}: SingleSelectEditFormExampleProps) => {
  const [searchString, setSearchString] = useState("");

  const form = useForm<SingleSelectForm>({
    resolver: zodResolver(singleSelectSchema),
    defaultValues: {
      selected: initialSelectedId,
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

  // Normalize single select ID to array format for the hook
  const selectedIds = initialSelectedId ? [initialSelectedId] : [];

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

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log("Form submitted:", data);
      })}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Select a blogger</Label>
        <Controller
          name="selected"
          control={form.control}
          render={({ field }) => (
            <MultiAsyncSelect
              async
              loading={isPending || isFetchingMissing}
              error={error}
              options={OPTIONS}
              value={field.value}
              onValueChange={(value) => {
                const newValue =
                  typeof value === "string" ? value : undefined;
                field.onChange(newValue);
              }}
              onSearch={handleSearch}
              placeholder="Select a blogger..."
              multiple={false}
              searchPlaceholder="Search bloggers..."
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

