"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AsyncSelectAllFormExample } from "./async-select-all-form-example";
import { AsyncSelectAllNonFormExample } from "./async-select-all-non-form-example";

export const AsyncSelectAllExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Async Select All with Excluded</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="async-form-toggle">Use Form</Label>
          <Switch
            id="async-form-toggle"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Async Select All Pattern</h3>
          <p className="text-sm text-muted-foreground">
            This example demonstrates the async select all pattern. When you
            click "Select all", it sets a special value (
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              __ALL__
            </code>
            ) to indicate that all items (loaded and will-be-loaded) are
            selected. When you unselect specific items, they are added to an{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              excluded
            </code>{" "}
            array. This pattern allows the backend to know that all items are
            selected except for the excluded ones.
          </p>
        </div>
        {isFormMode ? (
          <AsyncSelectAllFormExample />
        ) : (
          <AsyncSelectAllNonFormExample />
        )}
      </div>
    </div>
  );
};
