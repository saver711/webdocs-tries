// app/bloggers/page.tsx

"use client";

import Link from "next/link";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AsyncBigPageSizeExample } from "./components/async-big-page-size-example";
import { AsyncSelectAllExample } from "./components/async-select-all-example";
import { EditModeExample } from "./components/edit-mode-example";
import {
  EditModePaginatedExample,
  PaginatedExample,
} from "./components/paginated-example";
import { SelectAllExample } from "./components/select-all-example";
import { SingleExample } from "./components/single-example";

const exampleParser = parseAsStringEnum([
  "sync-select-all",
  "async-select-all",
  "async-big-page-size",
  "single-select",
  "edit-mode",
  "paginated",
  "edit-mode-paginated",
]).withDefault("sync-select-all");

function BloggersPageContent() {
  const [selectedExample, setSelectedExample] = useQueryState(
    "example",
    exampleParser,
  );

  const examples = [
    {
      id: "sync-select-all" as const,
      label: "Sync Select All",
      description: "Select all with static options (sync mode)",
    },
    {
      id: "async-select-all" as const,
      label: "Async Select All",
      description: "Select all with excluded items (async mode)",
    },
    {
      id: "async-big-page-size" as const,
      label: "Async Big Page Size",
      description: "Async search with large page size, no pagination",
    },
    {
      id: "single-select" as const,
      label: "Single Select",
      description: "Toggle between single and multi-select modes",
    },
    {
      id: "edit-mode" as const,
      label: "Edit Mode",
      description: "Edit mode with backend IDs (real-world scenario)",
    },
    {
      id: "paginated" as const,
      label: "Paginated",
      description:
        "Pagination with infinite scroll (single & multi in same view)",
    },
    {
      id: "edit-mode-paginated" as const,
      label: "Edit Mode + Paginated",
      description:
        "Edit mode with pagination (real-world scenario with infinite scroll)",
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Multi-Select Examples</h1>
          <p className="text-muted-foreground">
            Choose an example to test different multi-select patterns
          </p>
        </div>

        {/* Example Selector */}
        <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
          {examples.map((example) => (
            <Button
              key={example.id}
              variant={selectedExample === example.id ? "default" : "outline"}
              onClick={() => setSelectedExample(example.id)}
              className={cn(
                "transition-all",
                selectedExample === example.id && "shadow-sm",
              )}
            >
              {example.label}
            </Button>
          ))}
        </div>

        {/* Selected Example Description */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong>
              {examples.find((e) => e.id === selectedExample)?.label}:
            </strong>{" "}
            {examples.find((e) => e.id === selectedExample)?.description}
          </p>
        </div>

        {/* Render Selected Example */}
        <div className="border rounded-lg p-6 bg-background">
          {selectedExample === "sync-select-all" && <SelectAllExample />}
          {selectedExample === "async-select-all" && <AsyncSelectAllExample />}
          {selectedExample === "async-big-page-size" && (
            <AsyncBigPageSizeExample />
          )}
          {selectedExample === "single-select" && <SingleExample />}
          {selectedExample === "edit-mode" && <EditModeExample />}
          {selectedExample === "paginated" && <PaginatedExample />}
          {selectedExample === "edit-mode-paginated" && (
            <EditModePaginatedExample />
          )}
        </div>
      </div>
    </div>
  );
}

export default function BloggersPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-10 space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Multi-Select Examples</h1>
              <p className="text-muted-foreground">
                Choose an example to test different multi-select patterns
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <BloggersPageContent />
    </Suspense>
  );
}
