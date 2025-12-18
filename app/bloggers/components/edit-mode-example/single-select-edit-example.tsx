"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SIMULATED_BACKEND_DATA } from "./constants";
import { SingleSelectEditFormExample } from "./single-select-edit-form-example";
import { SingleSelectEditNonFormExample } from "./single-select-edit-non-form-example";

export const SingleSelectEditExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);
  const initialSelectedId = SIMULATED_BACKEND_DATA.singleSelect.selectedId;

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Single Select - Edit Mode</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Backend returned ID: <code>{initialSelectedId}</code>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="single-edit-form-toggle">Use Form</Label>
          <Switch
            id="single-edit-form-toggle"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
        </div>
      </div>

      {isFormMode ? (
        <SingleSelectEditFormExample initialSelectedId={initialSelectedId} />
      ) : (
        <SingleSelectEditNonFormExample initialSelectedId={initialSelectedId} />
      )}
    </div>
  );
};
