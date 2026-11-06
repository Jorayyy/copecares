import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700 dark:disabled:bg-zinc-900/50",
        className,
      )}
      {...props}
    />
  );
}
