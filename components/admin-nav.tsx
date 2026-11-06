"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Package,
  PawPrint,
  ReceiptText,
  Settings,
  ShoppingCart,
  Stethoscope,
  Tags,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Clinic",
    items: [
      { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
      {
        label: "Medical records",
        href: "/admin/medical-records",
        icon: Stethoscope,
      },
      { label: "Pets", href: "/admin/pets", icon: PawPrint },
      { label: "Pet categories", href: "/admin/pet-categories", icon: Tags },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Point of sale", href: "/admin/pos", icon: ShoppingCart },
      { label: "Sales", href: "/admin/pos/sales", icon: ReceiptText },
      { label: "Products", href: "/admin/products", icon: Package },
      {
        label: "Product categories",
        href: "/admin/product-categories",
        icon: Tags,
      },
      { label: "Services", href: "/admin/services", icon: Wrench },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "My profile", href: "/admin/profile", icon: UserRound },
    ],
  },
];

const allItems = groups.flatMap((group) => group.items);

function isActive(pathname: string, href: string) {
  const match = allItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match?.href === href;
}

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  if (compact) {
    return (
      <nav className="flex items-center gap-1 overflow-x-auto">
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
              isActive(pathname, item.href)
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

  return (
    <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-2">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {group.label}
          </p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "bg-dusk-50 text-dusk-700 [&>svg]:text-sunset-500 dark:bg-dusk-950/50 dark:text-dusk-300"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
