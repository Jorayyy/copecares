import * as React from "react";

import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  default:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success:
    "bg-dusk-100 text-dusk-800 dark:bg-dusk-950 dark:text-dusk-300",
  warning:
    "bg-sunset-100 text-sunset-800 dark:bg-sunset-950 dark:text-sunset-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  info: "bg-navy-100 text-navy-800 dark:bg-navy-950 dark:text-navy-300",
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
