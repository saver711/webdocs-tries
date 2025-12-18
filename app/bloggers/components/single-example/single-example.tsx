"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SingleSelectFormExample } from "./single-select-form-example";
import { SingleSelectNonFormExample } from "./single-select-non-form-example";

const STATIC_OPTIONS = [
  { value: "1", label: "React" },
  { value: "2", label: "Vue" },
  { value: "3", label: "Angular" },
  { value: "4", label: "Svelte" },
  { value: "5", label: "Next.js" },
  { value: "6", label: "Nuxt.js" },
  { value: "7", label: "Gatsby" },
  { value: "8", label: "Remix" },
  { value: "9", label: "Astro" },
  { value: "10", label: "SolidJS" },
];

export const SingleExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Single Select</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This example demonstrates both single-select and multi-select modes.
          In single-select mode, only one option can be selected at a time and
          the popover closes after selection. "Select all" is hidden in
          single-select mode.
        </p>
      </div>

      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Single Select Mode</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="single-form-toggle">Use Form</Label>
            <Switch
              id="single-form-toggle"
              checked={isFormMode}
              onCheckedChange={setIsFormMode}
            />
          </div>
        </div>

        {isFormMode ? (
          <SingleSelectFormExample options={STATIC_OPTIONS} />
        ) : (
          <SingleSelectNonFormExample options={STATIC_OPTIONS} />
        )}
      </div>
    </div>
  );
};

