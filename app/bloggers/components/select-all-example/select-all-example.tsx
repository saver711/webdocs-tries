"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Option } from "@/app/components/ui/multi-async-select";
import { SelectAllExample1Form } from "./select-all-example-1-form";
import { SelectAllExample1NonForm } from "./select-all-example-1-non-form";
import { SelectAllExample2Form } from "./select-all-example-2-form";
import { SelectAllExample2NonForm } from "./select-all-example-2-non-form";

// Static options for sync mode examples
const STATIC_OPTIONS: Option[] = [
  { label: "Alice Johnson", value: "1" },
  { label: "Bob Smith", value: "2" },
  { label: "Charlie Brown", value: "3" },
  { label: "Diana Prince", value: "4" },
  { label: "Ethan Hunt", value: "5" },
  { label: "Fiona Apple", value: "6" },
  { label: "George Washington", value: "7" },
  { label: "Hannah Montana", value: "8" },
  { label: "Isaac Newton", value: "9" },
  { label: "Julia Roberts", value: "10" },
  { label: "Kevin Hart", value: "11" },
  { label: "Luna Lovegood", value: "12" },
  { label: "Michael Jordan", value: "13" },
  { label: "Nina Simone", value: "14" },
  { label: "Oliver Twist", value: "15" },
];

export const SelectAllExample = () => {
  const [useForm1, setUseForm1] = useState(true);
  const [useForm2, setUseForm2] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Select All Feature Examples</h2>
        </div>
      </div>

      {/* Example 1: Simple Select All */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Example 1: Simple Select All
            </h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="example1-form-toggle">Use Form</Label>
              <Switch
                id="example1-form-toggle"
                checked={useForm1}
                onCheckedChange={setUseForm1}
              />
            </div>
          </div>
          <ul>
            <li>clearSearchOnClose: true</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This example demonstrates the basic select all functionality. When
            you click "Select all", it will select all currently loaded options.
            If you clear the search, it will select all available options. The
            select all checkbox shows the state based on whether all current
            options are selected.
          </p>
        </div>
        {useForm1 ? (
          <SelectAllExample1Form options={STATIC_OPTIONS} />
        ) : (
          <SelectAllExample1NonForm options={STATIC_OPTIONS} />
        )}
      </div>

      {/* Example 2: Select All with Search */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Example 2: Select All with Search Applied
            </h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="example2-form-toggle">Use Form</Label>
              <Switch
                id="example2-form-toggle"
                checked={useForm2}
                onCheckedChange={setUseForm2}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This example demonstrates select all behavior when search is
            applied. When you type in the search box and then click "Select
            all", it will only select the filtered/search results, not all
            options. This is useful when you want to select only the items
            matching your search criteria. Try searching for a specific blogger
            name and then click "Select all" to see it in action.
          </p>
        </div>
        {useForm2 ? (
          <SelectAllExample2Form options={STATIC_OPTIONS} />
        ) : (
          <SelectAllExample2NonForm options={STATIC_OPTIONS} />
        )}
      </div>
    </div>
  );
};

