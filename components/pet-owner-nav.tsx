"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, PawPrint, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/pet-owner", icon: LayoutDashboard },
  { label: "My pets", href: "/pet-owner/pets", icon: PawPrint },
  { label: "Appointments", href: "/pet-owner/appointments", icon: CalendarDays },
  { label: "Profile", href: "/pet-owner/profile", icon: UserRound },
];

export function PetOwnerNav() {
  const pathname = usePathname();

  const active = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
            active === item.href
              ? "bg-dusk-50 text-dusk-700 [&>svg]:text-sunset-500 dark:bg-dusk-950/50 dark:text-dusk-300"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
