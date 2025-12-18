"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiSelectEditModePaginatedFormExample } from "./edit-mode/multi-select/multi-select-form-example";
import { MultiSelectEditModePaginatedNonFormExample } from "./edit-mode/multi-select/multi-select-non-form-example";
import { SingleSelectEditModePaginatedFormExample } from "./edit-mode/single-select/single-select-form-example";
import { SingleSelectEditModePaginatedNonFormExample } from "./edit-mode/single-select/single-select-non-form-example";

const PER_PAGE = 8;

export const EditModePaginatedExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Edit Mode with Pagination Example
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <p>
            This example combines edit mode (real-world scenario with backend
            IDs) with pagination. Features:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Receives initial selected IDs from backend</li>
            <li>Fetches missing IDs that aren't in the first page</li>
            <li>Loads {PER_PAGE} items per page with infinite scroll</li>
            <li>Search resets pagination to page 1</li>
            <li>Shows loading indicator while fetching more items</li>
            <li>Multi-select supports async select all with excluded items</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="edit-paginated-form-toggle">Use Form</Label>
          <Switch
            id="edit-paginated-form-toggle"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isFormMode ? (
          <>
            <SingleSelectEditModePaginatedFormExample />
            <MultiSelectEditModePaginatedFormExample />
          </>
        ) : (
          <>
            <SingleSelectEditModePaginatedNonFormExample />
            <MultiSelectEditModePaginatedNonFormExample />
          </>
        )}
      </div>
    </div>
  );
};
