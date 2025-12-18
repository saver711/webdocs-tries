"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MultiAsyncSelect, type Option } from "@/app/components/ui/multi-async-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const singleSelectSchema = z.object({
  selected: z.string().optional(),
});

type SingleSelectForm = z.infer<typeof singleSelectSchema>;

interface SingleSelectFormExampleProps {
  options: Option[];
}

export const SingleSelectFormExample = ({ options }: SingleSelectFormExampleProps) => {
  const { control, handleSubmit, reset } = useForm<SingleSelectForm>({
    resolver: zodResolver(singleSelectSchema),
    defaultValues: {
      selected: undefined,
    },
  });

  const onSubmit = (data: SingleSelectForm) => {
    console.log("Single select form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Select a framework</Label>
        <Controller
          name="selected"
          control={control}
          render={({ field }) => (
            <MultiAsyncSelect
              options={options}
              value={field.value}
              onValueChange={(value) => {
                const newValue =
                  typeof value === "string" ? value : undefined;
                field.onChange(newValue);
              }}
              placeholder="Select a framework..."
              multiple={false}
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
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

