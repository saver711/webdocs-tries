"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect, type Option } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  selected: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

interface SelectAllExample2FormProps {
  options: Option[];
}

export const SelectAllExample2Form = ({ options }: SelectAllExample2FormProps) => {
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
      <div
        className={cn(
          "h-[220px] flex flex-col items-center justify-center border border-zinc-200 rounded-md dark:border-zinc-800 p-4",
        )}
      >
        <Controller
          name="selected"
          control={form.control}
          render={({ field }) => (
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

