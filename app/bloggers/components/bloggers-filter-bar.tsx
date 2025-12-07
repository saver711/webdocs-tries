// app/bloggers/components/bloggers-filter-bar.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "@/app/components/ui/date-picker";
import { useTablePagination } from "@/app/components/ui/table/hooks/use-table-pagination";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBloggersUrlState } from "../hooks/use-bloggers-url-state";

const filterSchema = z.object({
  name: z.string().nullable(),
  dateFrom: z.date().nullable(),
  dateTo: z.date().nullable(),
});

export type FilterInputs = z.infer<typeof filterSchema>;

function toUTCEndOfLocalDay(date: Date) {
  const localYear = date.getFullYear();
  const localMonth = date.getMonth();
  const localDay = date.getDate();

  const dLocalEnd = new Date(localYear, localMonth, localDay, 23, 59, 59, 999);
  return dLocalEnd.toISOString();
}

const parseUTCDate = (isoString: string | null) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
};

export const BloggersFilterBar = () => {
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useBloggersUrlState();
  const { setPagination } = useTablePagination();
  const filtersAppliedCount = Object.values(query).filter(
    (value) => value !== undefined && value !== null && value !== "",
  ).length;

  const form = useForm<FilterInputs>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      ...query,
      dateFrom: query.dateFrom ? parseUTCDate(query.dateFrom) : null,
      dateTo: query.dateTo ? parseUTCDate(query.dateTo) : null,
    },
  });

  const onSubmit = (values: FilterInputs) => {
    setQuery({
      ...values,
      dateFrom: values.dateFrom ? values.dateFrom.toISOString() : null,
      dateTo: values.dateTo ? toUTCEndOfLocalDay(values.dateTo) : null,
    });

    // Move to first page
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));

    drawerCloseRef.current?.click();
  };

  const handleReset = () => {
    form.reset();
  };

  function handleClear(): void {
    form.reset({
      dateFrom: null,
      dateTo: null,
      name: null,
    });
  }
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <Filter className="h-4 w-4" />
          <div>
            Filters{" "}
            {filtersAppliedCount > 0 && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                {filtersAppliedCount}
              </span>
            )}
          </div>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Bloggers</DrawerTitle>
        </DrawerHeader>

        <form
          className="h-full"
          onSubmit={form.handleSubmit(onSubmit)}
          id="bloggers-filter-form"
        >
          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Search by name..."
                {...form.register("name")}
              />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium">Created Date Range</span>
              <div className="flex gap-2 flex-wrap">
                <DatePicker
                  id="date-from"
                  date={form.watch("dateFrom") ?? undefined}
                  setDate={(date) => {
                    form.setValue("dateFrom", date ?? null);
                  }}
                  placeholder="From"
                />

                <DatePicker
                  id="date-to"
                  date={form.watch("dateTo") ?? undefined}
                  setDate={(date) => form.setValue("dateTo", date ?? null)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </form>

        <DrawerFooter className="mt-auto">
          <Button
            className="cursor-pointer"
            form="bloggers-filter-form"
            type="submit"
          >
            Apply Filters
          </Button>
          {/* RESET now resets to the default where we might have default values as non-empty values */}
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="cursor-pointer"
            type="button"
            variant="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
          <DrawerClose className="cursor-pointer" ref={drawerCloseRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
