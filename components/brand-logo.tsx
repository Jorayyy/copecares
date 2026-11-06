"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "grid place-items-center rounded-lg bg-emerald-600 font-bold text-white",
          className,
        )}
      >
        C
      </span>
    );
  }

  return (
    <Image
      src="/api/branding/logo"
      alt="CopeCares logo"
      width={64}
      height={64}
      unoptimized
      className={cn("rounded-lg object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}
