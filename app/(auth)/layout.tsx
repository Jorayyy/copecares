import Link from "next/link";
import Image from "next/image";
import { Clock3, MapPin, PawPrint, Phone } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { authCopy } from "@/lib/auth-copy";
import { getClinicProfile } from "@/lib/clinic-profile";
import { getLocale } from "@/lib/locale";

export const instant = false;

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const [profile, locale] = await Promise.all([
    getClinicProfile(),
    getLocale(),
  ]);
  const t = authCopy[locale];
  const photo = profile.gallerySlots[0];

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg dark:focus:bg-zinc-900 dark:focus:text-zinc-50"
      >
        {t.skip}
      </a>

      <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-10 text-white lg:flex">
        {photo ? (
          <Image
            src={`/api/branding/gallery/${photo}`}
            alt=""
            fill
            unoptimized
            sizes="50vw"
            className="object-cover opacity-30"
          />
        ) : (
          <PawPrint className="pointer-events-none absolute -right-16 -bottom-16 size-80 text-white/5" />
        )}
        <div className="absolute inset-0 bg-linear-to-br from-navy-950/95 via-navy-950/80 to-dusk-950/85" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <BrandLogo className="size-10 text-lg" />
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold">{profile.shortName}</span>
            <span className="mt-1 text-[11px] text-navy-200">
              Veterinary Clinic
            </span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sunset-400">
            <PawPrint className="size-4" />
            {profile.clinicName}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight font-semibold">
            {t.brandTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy-100/90">
            {t.brandBody}
          </p>
        </div>

        <div className="relative grid gap-3 text-sm text-navy-100">
          <p className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0" />
            {t.openHours} {profile.opening}–{profile.closing}
          </p>
          {profile.phone ? (
            <a
              href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2 hover:text-white"
            >
              <Phone className="size-4 shrink-0" />
              {profile.phone}
            </a>
          ) : null}
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {profile.address}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <header className="flex items-center justify-between gap-3 px-6 py-5">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <BrandLogo className="size-9 text-lg" />
            <span className="text-base font-semibold tracking-tight">
              {profile.shortName}
            </span>
          </Link>
          <Link
            href="/"
            className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 lg:inline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {t.backHome}
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <LanguageToggle locale={locale} />
            <ThemeToggle />
          </div>
        </header>

        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-8"
        >
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-5 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {t.privacy}
          </Link>
          <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {t.terms}
          </Link>
          <Link
            href="/accessibility"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {t.accessibility}
          </Link>
        </footer>
      </div>
    </div>
  );
}
