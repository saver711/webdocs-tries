"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LucideAirplay, LucideAlarmClockCheck } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { MultiAsyncSelect } from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const AsyncSelectAllFormExample = () => {
  const [searchString, setSearchString] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  const formSchema = z.object({
    selected: isRequired
      ? z.union([z.string(), z.array(z.string())]).refine(
          (val) => {
            if (typeof val === "string")
              return val === "__ALL__" || val.length > 0;
            return Array.isArray(val) && val.length > 0;
          },
          { message: "Please select at least one blogger" },
        )
      : z.union([z.string(), z.array(z.string())]),
    excluded: z.array(z.string()),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { selected: [], excluded: [] },
  });

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

  const selected = form.watch("selected");
  const excluded = form.watch("excluded");
  const allSelected = typeof selected === "string" && selected === "__ALL__";

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log("Form submitted:", data);
      })}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 pb-2">
        <Switch
          id="required-toggle"
          checked={isRequired}
          onCheckedChange={setIsRequired}
        />
        <Label htmlFor="required-toggle" className="cursor-pointer">
          Required field
        </Label>
      </div>
      <div
        className={cn(
          "flex flex-col items-center justify-center border border-zinc-200 rounded-md dark:border-zinc-800 p-4",
        )}
      >
        <Controller
          name="selected"
          control={form.control}
          render={({ field, fieldState }) => (
            <Controller
              name="excluded"
              control={form.control}
              render={({ field: excludedField }) => (
                <div className="space-y-1 w-full">
                  <Label className="block mb-2">
                    Select bloggers{" "}
                    {isRequired && <span className="text-destructive">*</span>}
                  </Label>
                  <MultiAsyncSelect
                    async
                    loading={isPending}
                    error={error}
                    options={OPTIONS}
                    value={field.value}
                    excluded={excludedField.value}
                    onValueChange={field.onChange}
                    onExcludedChange={excludedField.onChange}
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
                        <span className="text-xs text-gray-500">
                          ({option.value})
                        </span>
                      </div>
                    )}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-destructive mt-2">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          )}
        />
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Value sent to backend:</strong>{" "}
          <code className="bg-muted px-1 py-0.5 rounded">
            {JSON.stringify(selected)}
          </code>
        </p>
        {allSelected && excluded.length > 0 && (
          <p>
            <strong>Excluded items:</strong>{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              {JSON.stringify(excluded)}
            </code>
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          {allSelected
            ? `All selected${excluded.length > 0 ? ` (${excluded.length} excluded)` : ""}`
            : `${
                Array.isArray(selected) ? selected.length : 0
              } item(s) selected`}
        </p>
        <div className="flex items-center gap-2">
          <Button type="submit" variant="outline" size="sm">
            Submit Form
          </Button>
        </div>
      </div>
    </form>
  );
};
