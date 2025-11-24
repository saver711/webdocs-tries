// app/bloggers/utils/get-bloggers-table-columns.util.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatInTimeZone } from "date-fns-tz"
import { TableActionsCell } from "@/app/components/ui/table/table-actions-cell"
import { TableSelectAllCheckbox } from "@/app/components/ui/table/table-select-all-checkbox"
import { TableSelectRowCheckbox } from "@/app/components/ui/table/table-select-row-checkbox"
import { TableSortingButton } from "@/app/components/ui/table/table-sorting-button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DeleteBlogger } from "../components/delete-blogger"
import type { Blogger } from "../models/blogger.model"

interface BloggersTableColumnsProps {
  onDelete: (id: string) => void
}

export const getBloggersTableColumns = ({
  onDelete
}: BloggersTableColumnsProps): ColumnDef<Blogger>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => <TableSelectAllCheckbox table={table} />,
      cell: ({ row }) => <TableSelectRowCheckbox row={row} />,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "id",
      header: ({ column }) => <TableSortingButton column={column} label="ID" />,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            {row.original.id}
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <TableSortingButton column={column} label="Name" />
      )
    },
    {
      accessorKey: "bio",
      header: ({ column }) => <TableSortingButton column={column} label="Bio" />
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <TableSortingButton column={column} label="Created At" />
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt

        return formatInTimeZone(date, "UTC", "MMMM do, yyyy")
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActionsCell>
          <DropdownMenuItem asChild>
            <DeleteBlogger blogger={row.original} onDelete={onDelete} />
          </DropdownMenuItem>
        </TableActionsCell>
      )
    }
  ]
}
