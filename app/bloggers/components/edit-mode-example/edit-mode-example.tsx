import { MultiSelectEditExample } from "./multi-select-edit-example";
import { SingleSelectEditExample } from "./single-select-edit-example";

export const EditModeExample = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Edit Mode Example</h2>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <p>
            This example simulates a real-world edit mode scenario where the
            backend returns only IDs of selected items. The component needs to:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Display selected items with their labels (fetched from BE)</li>
            <li>Allow changing selection in single-select mode</li>
            <li>Allow adding/removing items in multi-select mode</li>
            <li>Handle async loading of options while showing selected IDs</li>
          </ul>
        </div>
      </div>

      <SingleSelectEditExample />
      <MultiSelectEditExample />
    </div>
  );
};

