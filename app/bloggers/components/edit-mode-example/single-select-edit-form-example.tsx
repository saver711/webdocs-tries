"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import UserAvatar from "@/assets/user.webp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFetchMissingBloggers } from "./hooks/use-fetch-missing-bloggers";
import { mergeOptions } from "./utils";

interface SingleSelectEditFormExampleProps {
  initialSelectedId: string;
}

export const SingleSelectEditFormExample = ({
  initialSelectedId,
}: SingleSelectEditFormExampleProps) => {
  const [searchString, setSearchString] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  const singleSelectSchema = z.object({
    selected: isRequired
      ? z.string("Please select a blogger").min(1, "Please select a blogger")
      : z.string().nullable().optional(),
  });

  type SingleSelectForm = z.infer<typeof singleSelectSchema>;

  const form = useForm<SingleSelectForm>({
    resolver: zodResolver(singleSelectSchema),
    defaultValues: {
      selected: initialSelectedId, // Keep the default value
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

  // Watch the current form value to fetch missing blogger if needed
  const currentSelectedId = form.watch("selected");
  // Handle both null and undefined as empty
  const selectedIds = currentSelectedId ? [currentSelectedId] : [];

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
      <div className="flex items-center gap-2 pb-2">
        <Switch
          id="required-toggle-1"
          checked={isRequired}
          onCheckedChange={setIsRequired}
        />
        <Label htmlFor="required-toggle-1" className="cursor-pointer">
          Required field
        </Label>
      </div>
      <div className="space-y-2">
        <Label>
          Select a blogger{" "}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
        <Controller
          name="selected"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <MultiAsyncSelect
                async
                loading={isPending || isFetchingMissing}
                error={error}
                options={OPTIONS}
                value={field.value ?? undefined}
                onValueChange={(value) => {
                  // Use null for cleared state (not undefined) to prevent reverting to defaultValues
                  const newValue = typeof value === "string" ? value : null;
                  field.onChange(newValue);
                }}
                onSearch={handleSearch}
                placeholder="Select a blogger..."
                multiple={false}
                searchPlaceholder="Search bloggers..."
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
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
