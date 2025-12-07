// app/bloggers/hooks/use-delete-bloggers.ts
import { useQueryClient } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBloggersAction } from "@/app/actions/delete-blogger.action";
import type { Blogger } from "../models/blogger.model";

interface UseDeleteBloggersProps {
  pagination: PaginationState;
  setPagination: (updater: (prev: PaginationState) => PaginationState) => void;
  currentDataLength?: number;
}

export const useDeleteBloggers = ({
  pagination,
  setPagination,
  currentDataLength,
}: UseDeleteBloggersProps) => {
  const queryClient = useQueryClient();
  const [selectedBloggers, setSelectedBloggers] = useState<Blogger[]>([]);

  const { execute: deleteBloggers } = useAction(deleteBloggersAction, {
    onSuccess: (data) => {
      toast.success("Blogger deleted successfully.");

      const deletedIds = data.input;

      if (
        currentDataLength &&
        currentDataLength === deletedIds.length &&
        pagination.pageIndex > 0
      ) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev.pageIndex - 1,
        }));
      } else {
        queryClient.invalidateQueries({ queryKey: ["bloggers"] });
      }

      setSelectedBloggers((prev) =>
        prev.filter((b) => !deletedIds.includes(b._id)),
      );
    },
    onError: (error) => {
      const errors = error.error.validationErrors;
      if (errors?._errors?.length) {
        errors._errors.forEach((errMsg: string) => {
          toast.error(errMsg);
        });
      } else {
        toast.error("An error occurred while deleting the blogger.");
      }
    },
  });

  return {
    selectedBloggers,
    setSelectedBloggers,
    deleteBloggers,
  };
};
