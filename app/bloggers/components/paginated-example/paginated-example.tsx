"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SingleSelectPaginatedFormExample } from "./single-select/single-select-form-example";
import { SingleSelectPaginatedNonFormExample } from "./single-select/single-select-non-form-example";
import { MultiSelectPaginatedFormExample } from "./multi-select/multi-select-form-example";
import { MultiSelectPaginatedNonFormExample } from "./multi-select/multi-select-non-form-example";

const PER_PAGE = 8;

export const PaginatedExample = () => {
  const [isFormMode, setIsFormMode] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Paginated Example</h2>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <p>
            This example demonstrates pagination with infinite scroll for both
            single and multi-select. Features:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Loads {PER_PAGE} items per page</li>
            <li>Automatically loads more when scrolling near bottom</li>
            <li>Search resets pagination to page 1</li>
            <li>Shows loading indicator while fetching more items</li>
            <li>Multi-select supports async select all with excluded items</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="paginated-form-toggle">Use Form</Label>
          <Switch
            id="paginated-form-toggle"
            checked={isFormMode}
            onCheckedChange={setIsFormMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isFormMode ? (
          <>
            <SingleSelectPaginatedFormExample />
            <MultiSelectPaginatedFormExample />
          </>
        ) : (
          <>
            <SingleSelectPaginatedNonFormExample />
            <MultiSelectPaginatedNonFormExample />
          </>
        )}
      </div>
    </div>
  );
};
