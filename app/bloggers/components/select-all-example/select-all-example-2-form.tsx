"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  MultiAsyncSelect,
  type Option,
} from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SelectAllExample2FormProps {
  options: Option[];
}

export const SelectAllExample2Form = ({
  options,
}: SelectAllExample2FormProps) => {
  const [isRequired, setIsRequired] = useState(false);

  const formSchema = z.object({
    selected: isRequired
      ? z.array(z.string()).min(1, "Please select at least one option")
      : z.array(z.string()),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { selected: [] },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log("Form submitted:", data);
      })}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 pb-2">
        <Switch
          id="required-toggle-2"
          checked={isRequired}
          onCheckedChange={setIsRequired}
        />
        <Label htmlFor="required-toggle-2" className="cursor-pointer">
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
            <div className="space-y-1 w-full">
              <Label className="block mb-2">
                Select options{" "}
                {isRequired && <span className="text-destructive">*</span>}
              </Label>
              <MultiAsyncSelect
                options={options}
                value={field.value}
                onValueChange={field.onChange}
                className="w-[480px]"
                searchPlaceholder="Search options (then select all)..."
                placeholder="Select options..."
                maxCount={3}
                clearSearchOnClose={false}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive mt-2">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        Selected: {form.watch("selected").length} item(s)
        <Button type="submit" variant="outline" size="sm">
          Submit Form
        </Button>
      </div>
    </form>
  );
};
