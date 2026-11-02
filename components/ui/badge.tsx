import * as React from "react";

import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  default:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tones[tone] ?? tones.default,
        className,
      )}
      {...props}
    />
  );
}

export function statusTone(status: string): keyof typeof tones {
  switch (status) {
    case "completed":
    case "confirmed":
    case "active":
      return "success";
    case "pending":
    case "in_progress":
      return "warning";
    case "cancelled":
    case "no_show":
    case "refunded":
      return "danger";
    default:
      return "default";
  }
}
