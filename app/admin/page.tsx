import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Clock3,
  PackageX,
  PawPrint,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { formatPeso, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard | CopeCares Admin",
};

const pipeline = [
  {
    status: "pending",
    label: "Pending",
    dot: "bg-amber-500",
    border: "border-l-amber-400",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    dot: "bg-emerald-500",
    border: "border-l-emerald-400",
  },
  {
    status: "in_progress",
    label: "In progress",
    dot: "bg-sky-500",
    border: "border-l-sky-400",
  },
  {
    status: "completed",
    label: "Completed",
    dot: "bg-zinc-400",
    border: "border-l-zinc-300",
  },
] as const;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [appointments, petCount, pendingCount, sales, products] =
    await Promise.all([
      prisma.appointment.findMany({
        where: {
          deletedAt: null,
          appointmentDate: { gte: today, lt: tomorrow },
        },
        orderBy: { appointmentTime: "asc" },
        include: {
          pet: { select: { name: true } },
          user: { select: { name: true } },
          veterinarian: { select: { name: true } },
          services: { include: { service: { select: { name: true } } } },
        },
      }),
      prisma.pet.count({ where: { deletedAt: null } }),
      prisma.appointment.count({
        where: { deletedAt: null, status: "pending" },
      }),
      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          deletedAt: null,
          status: "completed",
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      prisma.product.findMany({
        where: { deletedAt: null, isActive: true },
        select: { stockQuantity: true, reorderLevel: true },
      }),
    ]);

  const lowStock = products.filter(
    (product) => product.stockQuantity <= product.reorderLevel,
  ).length;

  const cancelled = appointments.filter((appointment) =>
    ["cancelled", "no_show"].includes(appointment.status),
  ).length;

  const stats = [
    {
      label: "Today's visits",
      value: appointments.length,
      hint:
        appointments.length === 0
          ? "No visits scheduled"
          : `${appointments.length - cancelled} active on the board`,
      icon: CalendarDays,
      tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      label: "Pending approval",
      value: pendingCount,
      hint: "Awaiting confirmation",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      label: "Today's sales",
      value: formatPeso(sales._sum.totalAmount ?? 0),
      hint: "Completed transactions",
      icon: Wallet,
      tone: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300",
    },
    {
      label: "Registered pets",
      value: petCount,
      hint: "Active pet profiles",
      icon: PawPrint,
      tone: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
    },
  ];

  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {greeting()}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Clinic dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </p>
        </div>
        <Link
          href="/admin/appointments/new"
          className={buttonVariants({ size: "lg" })}
        >
          <CalendarPlus className="size-4" />
          New appointment
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-xl ${stat.tone}`}
            >
              <stat.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                {stat.hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lowStock > 0 ? (
        <Link
          href="/admin/products"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <PackageX className="size-5 shrink-0" />
          <span className="flex-1">
            <span className="font-semibold">
              {lowStock} product{lowStock === 1 ? "" : "s"}
            </span>{" "}
            at or below the reorder level.
          </span>
          <span className="flex items-center gap-1 font-medium">
            Review stock
            <ArrowRight className="size-4" />
          </span>
        </Link>
      ) : null}

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Appointment pipeline
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Today&apos;s schedule by status
              {cancelled > 0 ? ` · ${cancelled} cancelled` : ""}
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-4">
          {pipeline.map((column) => {
            const items = appointments.filter(
              (appointment) => appointment.status === column.status,
            );

            return (
              <div
                key={column.status}
                className="flex flex-col gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    <span className={`size-2 rounded-full ${column.dot}`} />
                    {column.label}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                    Nothing here
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {items.map((appointment) => {
                      const petName =
                        appointment.pet?.name ??
                        appointment.petName ??
                        "Unnamed pet";
                      const ownerName =
                        appointment.user?.name ??
                        appointment.ownerName ??
                        "Walk-in";
                      const serviceNames = appointment.services
                        .map((item) => item.service.name)
                        .join(", ");

                      return (
                        <Link
                          key={appointment.id}
                          href={`/admin/appointments/${appointment.id}`}
                          className={`flex flex-col gap-1 rounded-lg border border-zinc-200 border-l-4 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${column.border}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                              {formatTime(appointment.appointmentTime)}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {appointment.code}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                            {petName}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {ownerName}
                            {appointment.veterinarian
                              ? ` · ${appointment.veterinarian.name}`
                              : ""}
                          </span>
                          {serviceNames ? (
                            <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                              {serviceNames}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {appointments.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400">
            No appointments scheduled today.{" "}
            <Link
              href="/admin/appointments/new"
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Book a visit
            </Link>{" "}
            or review{" "}
            <Link
              href="/admin/appointments"
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              all appointments
            </Link>
            .
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Appointments", href: "/admin/appointments" },
          { label: "Medical records", href: "/admin/medical-records" },
          { label: "Point of sale", href: "/admin/pos" },
          { label: "Products", href: "/admin/products" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {item.label}
            <ArrowRight className="size-3.5" />
          </Link>
        ))}
      </div>

    </div>
  );
}
