"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SIMULATED_BACKEND_DATA } from "./constants";
import { MultiSelectEditFormExample } from "./multi-select-edit-form-example";
import { MultiSelectEditNonFormExample } from "./multi-select-edit-non-form-example";

export const MultiSelectEditExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);
  const initialSelectedIds = SIMULATED_BACKEND_DATA.multiSelect.selectedIds;

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Multi Select - Edit Mode</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Backend returned IDs:{" "}
            <code>{JSON.stringify(initialSelectedIds)}</code>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="multi-edit-form-toggle">Use Form</Label>
          <Switch
            id="multi-edit-form-toggle"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
        </div>
      </div>

      {isFormMode ? (
        <MultiSelectEditFormExample initialSelectedIds={initialSelectedIds} />
      ) : (
        <MultiSelectEditNonFormExample
          initialSelectedIds={initialSelectedIds}
        />
      )}
    </div>
  );
};
