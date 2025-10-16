"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Blogger } from "../models/blogger.model";

interface DeleteBloggerProps {
  blogger: Blogger;
  onDelete: (id: string) => void;
}

export const DeleteBlogger = ({ blogger, onDelete }: DeleteBloggerProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onDelete(blogger.id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left px-2 py-1.5 text-red-600 cursor-pointer"
      >
        <Trash2 className="h-4 w-4 mr-2 inline" />
        Delete
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blogger</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{blogger.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
