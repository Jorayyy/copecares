import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth-routes";
import { Button } from "@/components/ui/button";

export const instant = false;

const navigation = [
  { label: "Dashboard", href: "/pet-owner", icon: LayoutDashboard },
];

export default async function PetOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "pet_owner") {
    redirect(homeForRole(session.user.role));
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/pet-owner" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
              C
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              CopeCares
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-50">
                {session.user.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pet owner
              </p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
