import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth-routes";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

async function RedirectIfSignedIn() {
  const session = await auth();

  if (session?.user) {
    redirect(homeForRole(session.user.role));
  }

  return null;
}

const features = [
  {
    title: "Appointments",
    description: "Book and manage clinic visits for every pet.",
  },
  {
    title: "Medical records",
    description: "Keep diagnoses, treatments, and vaccinations in one place.",
  },
  {
    title: "Point of sale",
    description: "Sell products and services with receipts and inventory.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>

      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <BrandLogo className="size-9 text-lg" />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            CopeCares
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
            Sign in
          </Link>
          <Link href="/register" className={buttonVariants()}>
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 py-20 text-center">
        <div className="flex flex-col items-center gap-5">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            Veterinary clinic management
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Care for every pet, from first visit to follow-up.
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            CopeCares brings appointments, pet records, vaccinations, and
            front-desk sales into one simple system.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Sign in to clinic
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Register as pet owner
            </Link>
          </div>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
