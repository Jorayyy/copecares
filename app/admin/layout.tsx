import Link from "next/link";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin-nav";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLES, homeForRole } from "@/lib/auth-routes";

export const instant = false;

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
        <Link href="/admin" className="flex items-center gap-2 px-6 py-5">
          <BrandLogo className="size-9 text-lg" />
          <div>
            <p className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
              CopeCares
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Clinic admin
            </p>
          </div>
        </Link>

        <AdminNav />

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
        <header className="flex flex-col gap-2 border-b border-zinc-200 bg-white px-4 py-3 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-2 lg:hidden">
              <BrandLogo className="size-8 text-sm" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                CopeCares
              </span>
            </Link>
            <p className="hidden text-sm text-zinc-500 lg:block dark:text-zinc-400">
              Signed in as{" "}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {session.user.name}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
          <div className="lg:hidden">
            <AdminNav compact />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
