import type { Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

type TableSelectRowCheckboxProps<T> = {
  row: Row<T>;
};
export const TableSelectRowCheckbox = <T,>({
  row,
}: TableSelectRowCheckboxProps<T>) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
  />
);
