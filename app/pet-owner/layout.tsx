import Link from "next/link";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PetOwnerNav } from "@/components/pet-owner-nav";
import { homeForRole } from "@/lib/auth-routes";

export const instant = false;

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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/pet-owner" className="flex items-center gap-2">
              <BrandLogo className="size-9 text-lg" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                CopeCares
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
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

          <PetOwnerNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
