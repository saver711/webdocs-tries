"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Blogger } from "@/app/bloggers/models/blogger.model";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Large page size to get all data at once
const LARGE_PAGE_SIZE = 1000;

export const AsyncBigPageSizeExampleForm = () => {
  const [isSingleRequired, setIsSingleRequired] = useState(false);
  const [isMultiRequired, setIsMultiRequired] = useState(false);

  const asyncSearchableFormSchema = z.object({
    singleSelect: isSingleRequired
      ? z.string("Please select a blogger").min(1, "Please select a blogger")
      : z.string().optional(),
    multiSelect: isMultiRequired
      ? z.array(z.string()).min(1, "Please select at least one blogger")
      : z.array(z.string()),
  });

  type AsyncSearchableForm = z.infer<typeof asyncSearchableFormSchema>;

  const form = useForm<AsyncSearchableForm>({
    resolver: zodResolver(asyncSearchableFormSchema),
    defaultValues: {
      singleSelect: undefined,
      multiSelect: [],
    },
  });

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

  const onSubmit = (data: AsyncSearchableForm) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Single Select */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="single-required-toggle"
            checked={isSingleRequired}
            onCheckedChange={setIsSingleRequired}
          />
          <Label htmlFor="single-required-toggle" className="cursor-pointer">
            Single select required
          </Label>
        </div>
        <Label htmlFor="single-select">
          Single Select{" "}
          {isSingleRequired && <span className="text-destructive">*</span>}
        </Label>
        <Controller
          name="singleSelect"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <MultiAsyncSelect
                options={OPTIONS}
                loading={isPending}
                error={error}
                multiple={false}
                placeholder="Select a blogger..."
                value={field.value}
                onValueChange={(value) => {
                  const newValue =
                    typeof value === "string" ? value : undefined;
                  field.onChange(newValue);
                }}
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

      {/* Multi Select */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="multi-required-toggle"
            checked={isMultiRequired}
            onCheckedChange={setIsMultiRequired}
          />
          <Label htmlFor="multi-required-toggle" className="cursor-pointer">
            Multi select required
          </Label>
        </div>
        <Label htmlFor="multi-select">
          Multi Select{" "}
          {isMultiRequired && <span className="text-destructive">*</span>}
        </Label>
        <Controller
          name="multiSelect"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <MultiAsyncSelect
                options={OPTIONS}
                loading={isPending}
                error={error}
                multiple={true}
                placeholder="Select bloggers..."
                value={field.value}
                onValueChange={(value) => {
                  const newValue = Array.isArray(value) ? value : [];
                  field.onChange(newValue);
                }}
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
        <Button type="submit">Submit Form</Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
      </div>

      {/* Display form values */}
      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-semibold">Form Values:</h4>
        <pre className="text-sm">{JSON.stringify(form.watch(), null, 2)}</pre>
      </div>
    </form>
  );
};
