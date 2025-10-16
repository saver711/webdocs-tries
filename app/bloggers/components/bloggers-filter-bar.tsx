// app/bloggers/components/bloggers-filter-bar.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// @ts-expect-error Butterfly has no types - Feel free to use the filtration mechanism of your choice
import { applyFilters } from "butterfly-data-filters";
import { Filter } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "@/app/components/ui/date-picker";
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
import type { Blogger } from "../models/blogger.model";

// Schema for validation
const filterSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

type FilterInputs = z.infer<typeof filterSchema>;

interface BloggersFilterBarProps {
  data: Blogger[];
  onFilter: (filteredData: Blogger[]) => void;
}

export const BloggersFilterBar = ({
  data,
  onFilter,
}: BloggersFilterBarProps) => {
  const drawerCloseRef = useRef<HTMLButtonElement>(null);

  const form = useForm<FilterInputs>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
      bio: "",
      dateFrom: undefined,
      dateTo: undefined,
    },
  });

  const onSubmit = (values: FilterInputs) => {
    const filters = [];

    if (values.name?.trim()) {
      filters.push({ field: "name", type: "string", value: values.name });
    }

    if (values.bio?.trim()) {
      filters.push({ field: "bio", type: "string", value: values.bio });
    }

    if (values.dateFrom || values.dateTo) {
      filters.push({
        field: "createdAt",
        type: "dateRange",
        value: values.dateFrom && values.dateTo ? "custom" : "_any",
        ...(values.dateFrom &&
          values.dateTo && {
            data: {
              from: values.dateFrom.toISOString().split("T")[0],
              until: values.dateTo.toISOString().split("T")[0],
            },
          }),
      });
    }

    const filteredData = applyFilters(filters, data);
    onFilter(filteredData);
    drawerCloseRef.current?.click();
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                placeholder="Search by bio..."
                {...form.register("bio")}
              />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium">Created Date Range</span>
              <div className="flex gap-2 flex-wrap">
                <DatePicker
                  id="date-from"
                  date={form.watch("dateFrom")}
                  setDate={(date) => form.setValue("dateFrom", date)}
                  placeholder="From"
                />
                <DatePicker
                  id="date-to"
                  date={form.watch("dateTo")}
                  setDate={(date) => form.setValue("dateTo", date)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </form>
        <DrawerFooter className="mt-auto">
          <Button form="bloggers-filter-form" type="submit">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <DrawerClose ref={drawerCloseRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
