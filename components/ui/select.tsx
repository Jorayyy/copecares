import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3.5 pr-10 text-sm text-zinc-900 shadow-sm transition-all hover:border-zinc-300 focus-visible:border-dusk-500 focus-visible:ring-4 focus-visible:ring-dusk-500/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700 dark:disabled:bg-zinc-900/50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
