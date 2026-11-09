import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getClinicProfile } from "@/lib/clinic-profile";
import { legalCopy } from "@/lib/legal-copy";
import { getLocale } from "@/lib/locale";

export const instant = false;

export default async function LegalLayout({ children }: LayoutProps<"/">) {
  const [locale, profile] = await Promise.all([
    getLocale(),
    getClinicProfile(),
  ]);
  const t = legalCopy[locale];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg dark:focus:bg-zinc-900 dark:focus:text-zinc-50"
      >
        {t.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="size-9 text-lg" />
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">
                {profile.shortName}
              </span>
              <span className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                Veterinary Clinic
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/privacy"
              className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {t.nav.privacy}
            </Link>
            <Link
              href="/terms"
              className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {t.nav.terms}
            </Link>
            <Link
              href="/accessibility"
              className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {t.nav.accessibility}
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <LanguageToggle locale={locale} />
            <ThemeToggle />
            <Link
              href="/"
              className="ml-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {t.nav.back}
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-zinc-500 dark:text-zinc-400">
          <p>
            © {new Date().getFullYear()} {profile.clinicName}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              {t.nav.privacy}
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              {t.nav.terms}
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {t.nav.accessibility}
            </Link>
            {profile.email ? (
              <a href={`mailto:${profile.email}`} className="hover:text-zinc-900 dark:hover:text-zinc-50">
                {profile.email}
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
