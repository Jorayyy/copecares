import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FlaskConical,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth-routes";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { formatPeso, formatTime } from "@/lib/format";
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

const navigation = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const careAreas = [
  {
    label: "Consultations",
    icon: Stethoscope,
    gradient: "from-dusk-500 to-dusk-700",
  },
  {
    label: "Vaccinations",
    icon: Syringe,
    gradient: "from-navy-600 to-navy-800",
  },
  {
    label: "Grooming",
    icon: Scissors,
    gradient: "from-sunset-400 to-sunset-600",
  },
  {
    label: "Surgery",
    icon: HeartPulse,
    gradient: "from-dusk-700 to-navy-900",
  },
  {
    label: "Dental care",
    icon: Sparkles,
    gradient: "from-sunset-500 to-dusk-600",
  },
  {
    label: "Laboratory",
    icon: FlaskConical,
    gradient: "from-navy-700 to-dusk-800",
  },
];

const testimonials = [
  {
    quote:
      "The team was gentle with my senior dog and explained every step. Booking online was quick, and they followed up after the visit.",
    name: "Ana R.",
    detail: "Dog owner",
  },
  {
    quote:
      "Clean clinic, friendly vets, and easy scheduling. My cat's vaccination and check-up were done in one visit.",
    name: "Mark T.",
    detail: "Cat owner",
  },
  {
    quote:
      "They helped us with an urgent case and kept us updated the whole time. We trust CopeCares with our pets.",
    name: "Grace L.",
    detail: "Pet owner",
  },
];

const faqs = [
  {
    question: "Do I need an appointment to visit?",
    answer:
      "Appointments help us prepare for your pet, but walk-in visits are welcome when the schedule allows. Booking online is the fastest way to reserve a slot.",
  },
  {
    question: "What kinds of pets do you treat?",
    answer:
      "We care for dogs, cats, birds, hamsters, rabbits, fish, reptiles, and other companion animals.",
  },
  {
    question: "How do I book online?",
    answer:
      "Create a pet owner account, add your pet's profile, then choose a service, date, and time. You can track and cancel appointments from your dashboard.",
  },
  {
    question: "What should I bring to the first visit?",
    answer:
      "Bring any previous medical records, vaccination history, and a list of current medications. A leash or carrier keeps your pet comfortable and safe.",
  },
  {
    question: "Do you offer grooming and dental care?",
    answer:
      "Yes. Basic and full grooming, dental cleaning, vaccinations, laboratory tests, and surgery are available. Ask the front desk for a recommendation.",
  },
  {
    question: "How can I reach the clinic?",
    answer:
      "Call or message us on Facebook during clinic hours. You can also send an inquiry through the details in the contact section.",
  },
];

async function LandingContent() {
  await connection();

  const session = await auth();

  if (session?.user) {
    redirect(homeForRole(session.user.role));
  }

  const [settingRows, services, veterinarians, galleryRows] =
    await Promise.all([
      prisma.setting.findMany({
        where: {
          key: {
            in: [
              "clinic_name",
              "clinic_short_name",
              "clinic_email",
              "clinic_phone",
              "clinic_address",
              "opening_time",
              "closing_time",
            ],
          },
        },
        select: { key: true, value: true },
      }),
      prisma.service.findMany({
        where: { deletedAt: null, isActive: true },
        orderBy: { name: "asc" },
        take: 6,
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
      prisma.setting.findMany({
        where: {
          key: { startsWith: "clinic_gallery_" },
          value: { not: null },
        },
        select: { key: true },
      }),
    ]);

  const settings = new Map(
    settingRows.map((setting) => [setting.key, setting.value]),
  );

  const shortName = settings.get("clinic_short_name") ?? "CopeCares";
  const clinicName =
    settings.get("clinic_name") ?? "CopeCares Veterinary Clinic";
  const phone = settings.get("clinic_phone") ?? "";
  const email = settings.get("clinic_email") ?? "";
  const address =
    settings.get("clinic_address") ?? "Tacloban City, Philippines";
  const opening = formatTime(settings.get("opening_time") ?? "08:00");
  const closing = formatTime(settings.get("closing_time") ?? "17:00");

  const gallerySlots = galleryRows
    .map((row) => /^clinic_gallery_([1-6])$/.exec(row.key)?.[1])
    .filter((slot): slot is string => Boolean(slot))
    .map(Number)
    .sort((a, b) => a - b);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const facebookFeed = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    FACEBOOK_URL,
  )}&tabs=timeline&width=500&height=640&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo className="size-9 text-lg" />
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: "sm", variant: "accent" })}
            >
              Book a visit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-dusk-50 via-white to-white dark:from-dusk-950/20 dark:via-zinc-950 dark:to-zinc-950" />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sunset-200 bg-sunset-50 px-3 py-1 text-xs font-medium text-sunset-700 dark:border-sunset-900 dark:bg-sunset-950/40 dark:text-sunset-300">
                <PawPrint className="size-3.5" />
                Veterinary care in Tacloban
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                Care for every pet, from first visit to follow-up.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                {clinicName} brings appointments, pet records, vaccinations,
                grooming, and front-desk care into one simple clinic.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className={buttonVariants({ size: "lg", variant: "accent" })}
                >
                  <CalendarDays className="size-5" />
                  Book an appointment
                </Link>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  <MessageCircle className="size-5" />
                  Message us
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-2">
                  <Clock3 className="size-4 text-dusk-600 dark:text-dusk-400" />
                  Daily {opening} – {closing}
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-dusk-600 dark:text-dusk-400" />
                  Complete medical records
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-dusk-600 dark:text-dusk-400" />
                  Walk-ins welcome
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-navy-900 via-navy-800 to-dusk-700 p-8 text-white shadow-xl shadow-navy-950/30">
                <div className="absolute -right-10 -top-10 size-48 rounded-full bg-sunset-400/20" />
                <div className="absolute -bottom-16 -left-10 size-56 rounded-full bg-white/10" />
                <div className="relative flex flex-col gap-6">
                  <div className="grid size-20 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                    <PawPrint className="size-10" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Your clinic team
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      Compassionate care, modern tools.
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                      <p className="text-xs text-white/70">Open today</p>
                      <p className="mt-0.5 text-sm font-semibold">
                        {opening} – {closing}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                      <p className="text-xs text-white/70">Call us</p>
                      <p className="mt-0.5 truncate text-sm font-semibold">
                        {phone || "Message us online"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
                  Services
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                  Everything your pet needs
                </h2>
              </div>
              <Link
                href="/register"
                className={buttonVariants({ variant: "outline" })}
              >
                Book a service
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-dusk-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-dusk-900"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-dusk-50 text-dusk-600 transition-colors group-hover:bg-dusk-600 group-hover:text-white dark:bg-dusk-950/50 dark:text-dusk-300">
                    <Stethoscope className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                    {service.name}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {service.description ?? "Professional care for your pet."}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatPeso(service.price)}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {service.durationMinutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
                About the clinic
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                A calmer, clearer clinic experience
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                {clinicName} is built around the everyday realities of pet care:
                quick check-ups, follow-ups, vaccinations, and the moments when
                you need answers fast. Our team keeps records organized so every
                visit starts with context, not questions.
              </p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                From the front desk to the consultation room, we aim for clear
                pricing, gentle handling, and practical next steps for your pet.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Complete pet and medical records",
                  "Appointments, walk-ins, and follow-ups",
                  "Grooming, dental, and laboratory services",
                  "Easy online booking and reminders",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Gentle handling",
                  body: "Low-stress visits for anxious pets, with clear guidance for owners.",
                  icon: HeartPulse,
                },
                {
                  title: "Organized records",
                  body: "Vaccinations, diagnoses, and treatments stay in one timeline.",
                  icon: ShieldCheck,
                },
                {
                  title: "Practical pricing",
                  body: "Know the service total before you book.",
                  icon: CheckCircle2,
                },
                {
                  title: "Easy follow-up",
                  body: "Book the next visit and keep track of what is due.",
                  icon: CalendarDays,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <card.icon className="size-5 text-dusk-600 dark:text-dusk-400" />
                  <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
              Our team
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              People your pet can trust
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {veterinarians.map((vet) => (
                <div
                  key={vet.id}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-dusk-50 text-lg font-semibold text-dusk-700 dark:bg-dusk-950/50 dark:text-dusk-300">
                    {vet.name
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                      {vet.name}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Veterinarian
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                  <Users className="size-6" />
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Clinic staff
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Front desk and pet care assistants
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="reviews"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
              Reviews
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              What pet owners say
            </h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex gap-0.5 text-sunset-500">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Sparkles key={star} className="size-4" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm text-zinc-600 dark:text-zinc-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {testimonial.name}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {testimonial.detail}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-dusk-600 hover:text-dusk-700 dark:text-dusk-400"
            >
              <FacebookIcon className="size-4" />
              Read more reviews on Facebook
              <ArrowRight className="size-4" />
            </a>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
              Gallery
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Inside the clinic
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallerySlots.length > 0
                ? gallerySlots.map((slot) => (
                    <div
                      key={slot}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <Image
                        src={`/api/branding/gallery/${slot}`}
                        alt={`Clinic photo ${slot}`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))
                : careAreas.map((area) => (
                    <div
                      key={area.label}
                      className={`relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white ${area.gradient}`}
                    >
                      <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
                      <div className="absolute right-8 top-10 size-16 rounded-full bg-white/10" />
                      <area.icon className="relative size-8" />
                      <p className="relative mt-3 text-lg font-semibold">
                        {area.label}
                      </p>
                      <p className="relative text-sm text-white/80">
                        Care that keeps pets comfortable.
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-24 border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
                Visit us
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Location and hours
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Drop by or book ahead. We are happy to help you plan the next
                visit.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Address
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {address}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <Clock3 className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Hours
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Daily {opening} – {closing}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <Phone className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Phone
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {phone ? (
                          <a
                            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                            className="hover:text-dusk-600 dark:hover:text-dusk-400"
                          >
                            {phone}
                          </a>
                        ) : (
                          "Message us on Facebook"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-dusk-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-dusk-900"
                  >
                    <Mail className="mt-0.5 size-5 shrink-0 text-dusk-600 dark:text-dusk-400" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        Email
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {email}
                      </p>
                    </div>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800">
              <iframe
                title={`Map of ${address}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-80 w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="scroll-mt-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
                Facebook
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Follow the clinic on Facebook
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                See announcements, clinic updates, and pet care tips. Message us
                directly if you have a quick question.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants()}
                >
                  <FacebookIcon className="size-4" />
                  Visit our page
                </a>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  <MessageCircle className="size-4" />
                  Message on Messenger
                </a>
              </div>
            </div>

            <div className="flex justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm lg:justify-end dark:border-zinc-800 dark:bg-zinc-900">
              <iframe
                title="CopeCares Facebook feed"
                src={facebookFeed}
                width={500}
                height={640}
                loading="lazy"
                className="h-[640px] w-full max-w-[500px] rounded-xl border-0"
              />
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
        >
          <div className="mx-auto w-full max-w-4xl px-6 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sunset-600 dark:text-sunset-400">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Common questions
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {faq.question}
                    <ChevronDown className="size-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy-900 dark:bg-navy-950">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14 text-white">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to book your visit?
              </h2>
              <p className="mt-2 text-navy-100/90">
                Create an account, add your pet, and choose a time that works.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className={buttonVariants({ size: "lg", variant: "accent" })}
              >
                Book an appointment
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo className="size-9 text-lg" />
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {shortName}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Veterinary clinic management and care for pets in Tacloban.
              Appointments, medical records, grooming, and more.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-sunset-300 hover:text-sunset-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Messenger"
                className="grid size-9 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-sunset-300 hover:text-sunset-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Quick links
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              {navigation.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-dusk-600 dark:hover:text-dusk-400"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Contact
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {address}
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="size-4 shrink-0" />
                Daily {opening} – {closing}
              </li>
              {phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-dusk-600 dark:hover:text-dusk-400"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <p>
              © {new Date().getFullYear()} {clinicName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-dusk-600">
                Staff sign in
              </Link>
              <Link href="/register" className="hover:text-dusk-600">
                Pet owner registration
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
