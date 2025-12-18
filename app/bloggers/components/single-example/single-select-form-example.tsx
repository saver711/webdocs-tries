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

interface SingleSelectFormExampleProps {
  options: Option[];
}

export const SingleSelectFormExample = ({
  options,
}: SingleSelectFormExampleProps) => {
  const [isRequired, setIsRequired] = useState(false);

  const singleSelectSchema = z.object({
    selected: isRequired
      ? z
          .string("Please select a framework")
          .min(1, "Please select a framework")
      : z.string().optional(),
  });

  type SingleSelectForm = z.infer<typeof singleSelectSchema>;

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
      <div className="space-y-2">
        <Label>
          Select a framework{" "}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
        <Controller
          name="selected"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
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
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
