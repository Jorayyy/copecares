import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Thumbnail({
  src,
  alt = "",
  shape = "square",
  className,
}: {
  src?: string | null;
  alt?: string;
  shape?: "square" | "circle";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={160}
          height={160}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        <ImageIcon className="size-4 text-zinc-400" />
      )}
    </div>
  );
}
