import type { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

type TableSelectAllCheckboxProps<T> = {
  table: Table<T>;
};
export const TableSelectAllCheckbox = <T,>({
  table,
}: TableSelectAllCheckboxProps<T>) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
);
