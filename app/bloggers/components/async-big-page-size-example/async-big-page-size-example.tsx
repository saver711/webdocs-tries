"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AsyncBigPageSizeExampleForm } from "./async-big-page-size-example-form";
import { AsyncBigPageSizeExampleNonForm } from "./async-big-page-size-example-non-form";

export const AsyncBigPageSizeExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Async Searchable Example (No Pagination)
          </h3>
          <p className="text-sm text-muted-foreground">
            Large page size, async search, no pagination
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="form-mode"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
          <Label htmlFor="form-mode">Use Form</Label>
        </div>
      </div>

      {isFormMode ? (
        <AsyncBigPageSizeExampleForm />
      ) : (
        <AsyncBigPageSizeExampleNonForm />
      )}
    </div>
  );
};
