import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth-routes";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { getClinicProfile } from "@/lib/clinic-profile";
import { formatPeso } from "@/lib/format";
import { landingCopy } from "@/lib/landing-copy";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=100064049321842";
const MESSENGER_URL =
  "https://www.facebook.com/messages/t/100064049321842";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.49-1.46H16.6V4.45A20.6 20.6 0 0 0 14.3 4.3c-2.31 0-3.9 1.41-3.9 4v2.2H8v3h2.4V21h3.1Z" />
    </svg>
  );
}

async function LandingContent() {
  await connection();

  const session = await auth();

  if (session?.user) {
    redirect(homeForRole(session.user.role));
  }

  const locale = await getLocale();
  const t = landingCopy[locale];

  const [profile, services, veterinarians] = await Promise.all([
    getClinicProfile(),
    prisma.service.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      take: 8,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        durationMinutes: true,
      },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { slug: "veterinarian" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const photos = profile.gallerySlots.map((slot) => ({
    slot,
    src: `/api/branding/gallery/${slot}`,
  }));

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    profile.address,
  )}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    profile.address,
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg dark:focus:bg-zinc-900 dark:focus:text-zinc-50"
      >
        {t.skip}
      </a>

      <div className="bg-navy-950 text-navy-100">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              {t.topbar.hours} {profile.opening}–{profile.closing}
            </span>
            {profile.phone ? (
              <a
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <Phone className="size-3.5" />
                {profile.phone}
              </a>
            ) : null}
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="size-3.5" />
              {profile.address}
            </span>
          </div>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white"
          >
            <FacebookIcon className="size-3.5" />
            Facebook
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="size-9 text-lg" />
            <span className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">
                {profile.shortName}
              </span>
              <span className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.clinicLabel}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden items-center gap-1 lg:flex">
              <LanguageToggle locale={locale} />
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t.footer.staff}
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: "sm", variant: "accent" })}
            >
              {t.hero.primary}
            </Link>

            <details className="relative lg:hidden">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                aria-label="Menu"
              >
                <Menu className="size-5" />
              </summary>
              <div className="absolute right-0 top-12 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                {t.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-zinc-200 px-1 pt-2 dark:border-zinc-800">
                  <LanguageToggle locale={locale} />
                  <ThemeToggle />
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                <PawPrint className="size-4" />
                {t.hero.eyebrow}
              </p>
              <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.4rem] dark:text-zinc-50">
                {t.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
                {t.hero.body(profile.clinicName)}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className={buttonVariants({ size: "lg", variant: "accent" })}
                >
                  <CalendarDays className="size-5" />
                  {t.hero.primary}
                </Link>
                {profile.phone ? (
                  <a
                    href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                    className={buttonVariants({ size: "lg", variant: "outline" })}
                  >
                    <Phone className="size-5" />
                    {t.hero.secondary}
                  </a>
                ) : (
                  <a
                    href={MESSENGER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: "lg", variant: "outline" })}
                  >
                    <MessageCircle className="size-5" />
                    {t.hero.secondaryFallback}
                  </a>
                )}
              </div>

              <ul className="mt-8 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <Clock3 className="size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  {t.hero.trust[0]} {profile.opening}–{profile.closing}
                </li>
                {t.hero.trust.slice(1).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    <Image
                      src={photos[0].src}
                      alt={`Clinic photo ${photos[0].slot}`}
                      fill
                      unoptimized
                      priority
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {photos.slice(1, 3).map((photo) => (
                    <div
                      key={photo.slot}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <Image
                        src={photo.src}
                        alt={`Clinic photo ${photo.slot}`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 22vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-dusk-50 text-dusk-700 dark:bg-dusk-950/60 dark:text-dusk-300">
                      <PawPrint className="size-6" />
                    </span>
                    <div>
                      <p className="font-semibold">{profile.clinicName}</p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {profile.address}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-6 grid gap-4 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-800">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                      <div>
                        <dt className="font-medium">{t.topbar.hours}</dt>
                        <dd className="text-zinc-500 dark:text-zinc-400">
                          {profile.opening}–{profile.closing}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                      <div>
                        <dt className="font-medium">{t.topbar.phone}</dt>
                        <dd className="text-zinc-500 dark:text-zinc-400">
                          {profile.phone || t.contact.fallbackPhone}
                        </dd>
                      </div>
                    </div>
                  </dl>
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                    <Camera className="mt-0.5 size-4 shrink-0" />
                    <p>
                      {t.hero.photoCaption} {t.hero.photoHint}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-sunset-600 dark:text-sunset-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t.contact.address}
                </p>
                <p className="mt-1 text-sm">{profile.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-5 shrink-0 text-sunset-600 dark:text-sunset-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t.contact.hours}
                </p>
                <p className="mt-1 text-sm">
                  {t.topbar.hours} {profile.opening}–{profile.closing}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-sunset-600 dark:text-sunset-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t.contact.phone}
                </p>
                <p className="mt-1 text-sm">
                  {profile.phone ? (
                    <a
                      href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                      className="hover:underline"
                    >
                      {profile.phone}
                    </a>
                  ) : (
                    t.contact.fallbackPhone
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                  {t.services.eyebrow}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  {t.services.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.services.intro}
                </p>
              </div>
              <Link
                href="/register"
                className={buttonVariants({ variant: "outline" })}
              >
                {t.services.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {services.length === 0 ? (
              <p className="mt-8 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                {t.services.empty}
              </p>
            ) : (
              <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="flex flex-wrap items-start justify-between gap-4 bg-white px-5 py-4 sm:flex-nowrap dark:bg-zinc-950"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                          {service.description ?? t.services.fallback}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-5 text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {service.durationMinutes} {t.services.duration}
                        </span>
                        <span className="w-24 text-right font-semibold">
                          {formatPeso(service.price)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                {t.about.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.about.title}
              </h2>
              <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.about.body(profile.clinicName)}
              </p>
              <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.about.body2}
              </p>

              <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
                {t.about.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {t.about.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-medium">{card.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                {t.visit.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.visit.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.visit.intro}
              </p>
            </div>

            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {t.visit.steps.map((step, index) => (
                <li key={step.title} className="border-t-2 border-sunset-500 pt-4">
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Stethoscope className="mt-0.5 size-4 shrink-0" />
              {t.visit.note}
            </p>
          </div>
        </section>

        <section id="team" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
              {t.team.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.team.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t.team.intro}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {veterinarians.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t.team.empty}
                </p>
              ) : (
                veterinarians.map((vet) => (
                  <div
                    key={vet.id}
                    className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-dusk-50 text-sm font-semibold text-dusk-700 dark:bg-dusk-950/60 dark:text-dusk-300">
                      {vet.name
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{vet.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {t.team.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div className="flex items-center gap-4 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{t.team.staffTitle}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t.team.staffBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="gallery"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
              {t.gallery.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.gallery.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t.gallery.intro}
            </p>

            {photos.length > 0 ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <div
                    key={photo.slot}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <Image
                      src={photo.src}
                      alt={`Clinic photo ${photo.slot}`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-950">
                <Camera className="size-8 text-zinc-400" />
                <p className="mt-3 text-sm font-medium">{t.gallery.empty}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {t.gallery.uploadNote}
                </p>
              </div>
            )}
          </div>
        </section>

        <section id="reviews" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-8 rounded-2xl bg-navy-900 p-8 text-white lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10 dark:bg-navy-950">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-400">
                  {t.reviews.eyebrow}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
                  {t.reviews.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy-100/90">
                  {t.reviews.body}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-50"
                >
                  <FacebookIcon className="size-4" />
                  {t.reviews.cta}
                </a>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/30 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="size-4" />
                  {t.reviews.messenger}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                <ShieldCheck className="size-4" />
                {t.readiness.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.readiness.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.readiness.body}
              </p>
              <Link
                href="/privacy"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-dusk-700 hover:underline dark:text-dusk-300"
              >
                {t.readiness.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="grid gap-3">
              {t.readiness.bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
                {t.contact.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {t.contact.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.contact.body}
              </p>

              <dl className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start gap-3 p-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {t.contact.address}
                    </dt>
                    <dd className="mt-1 text-sm">{profile.address}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4">
                  <Clock3 className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {t.contact.hours}
                    </dt>
                    <dd className="mt-1 text-sm">
                      {t.topbar.hours} {profile.opening}–{profile.closing}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4">
                  <Phone className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {t.contact.phone}
                    </dt>
                    <dd className="mt-1 text-sm">
                      {profile.phone ? (
                        <a
                          href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                          className="hover:underline"
                        >
                          {profile.phone}
                        </a>
                      ) : (
                        t.contact.fallbackPhone
                      )}
                    </dd>
                  </div>
                </div>
                {profile.email ? (
                  <div className="flex items-start gap-3 p-4">
                    <Mail className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {t.contact.email}
                      </dt>
                      <dd className="mt-1 text-sm">
                        <a
                          href={`mailto:${profile.email}`}
                          className="hover:underline"
                        >
                          {profile.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
              </dl>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-dusk-700 hover:underline dark:text-dusk-300"
              >
                <MapPin className="size-4" />
                {t.contact.directions}
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <iframe
                title={t.contact.mapTitle}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-96 w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
              {t.faq.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.faq.title}
            </h2>

            <div className="mt-8 flex flex-col gap-2.5">
              {t.faq.items.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                    {faq.question}
                    <ChevronDown className="size-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy-950 text-navy-100">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo className="size-9 text-lg" />
              <span className="text-base font-semibold text-white">
                {profile.clinicName}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-200">
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-lg border border-white/20 text-navy-100 transition-colors hover:border-white/50 hover:text-white"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Messenger"
                className="grid size-9 place-items-center rounded-lg border border-white/20 text-navy-100 transition-colors hover:border-white/50 hover:text-white"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {t.footer.quickLinks}
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {t.footer.legal}
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white">
                  {t.footer.accessibility}
                </Link>
              </li>
              {profile.email ? (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-white"
                  >
                    {t.footer.privacyContact}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-navy-300">
            <p>
              © {new Date().getFullYear()} {profile.clinicName}.{" "}
              {t.footer.rights}
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-white">
                {t.footer.staff}
              </Link>
              <Link href="/register" className="hover:text-white">
                {t.footer.owner}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800" />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4 px-6 py-20">
        <div className="h-6 w-40 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-12 w-full max-w-xl animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-4 w-full max-w-md animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-11 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LandingFallback />}>
      <LandingContent />
    </Suspense>
  );
}
