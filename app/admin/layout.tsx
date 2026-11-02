import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { ADMIN_ROLES, homeForRole } from "@/lib/auth-routes";
import { Button } from "@/components/ui/button";

export const instant = false;

const navigation = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!ADMIN_ROLES.includes(session.user.role)) {
    redirect(homeForRole(session.user.role));
  }

  return (
    <div className="flex min-h-screen flex-1 bg-zinc-50 dark:bg-zinc-950">
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
            C
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
              CopeCares
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Clinic admin
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {session.user.name}
          </p>
          <p className="text-xs capitalize text-zinc-500 dark:text-zinc-400">
            {session.user.role.replace("_", " ")}
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-3 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              C
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              CopeCares
            </span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="ml-auto">
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
