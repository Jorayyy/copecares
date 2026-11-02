"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  message = "Delete this record? This cannot be undone.",
  label,
  small = true,
}: {
  message?: string;
  label?: string;
  small?: boolean;
}) {
  return (
    <Button
      type="submit"
      variant="ghost"
      size={small ? "sm" : "default"}
      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 className="size-4" />
      {label}
    </Button>
  );
}
