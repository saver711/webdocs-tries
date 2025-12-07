// app/bloggers/utils/filter-bloggers.ts
// @ts-expect-error Butterfly has no types
import { applyFilters } from "butterfly-data-filters";
import type { FilterInputs } from "../components/bloggers-filter-bar";
import type { Blogger } from "../models/blogger.model";

type FilterProps = Omit<FilterInputs, "dateFrom" | "dateTo"> & {
  dateFrom?: string | null;
  dateTo?: string | null;
};
export const filterBloggers = (values: FilterProps, data: Blogger[]) => {
  const filters = [];

  if (values.name?.trim()) {
    filters.push({ field: "name", type: "string", value: values.name });
  }

  if (values.dateFrom || values.dateTo) {
    const from = values.dateFrom;
    const until = values.dateTo;

    filters.push({
      field: "createdAt",
      type: "dateRange",
      value: values.dateFrom || values.dateTo ? "custom" : "_any",
      ...(from || until
        ? {
            data: {
              from,
              until,
            },
          }
        : {}),
    });
  }

  return applyFilters(filters, data) as Blogger[];
};
