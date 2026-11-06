import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { deleteAppointment } from "@/lib/actions/appointments";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPOINTMENT_STATUSES,
  appointmentStatusLabel,
  isAppointmentStatus,
} from "@/lib/clinic";
import { formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Appointments" };

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status, date, q } = await searchParams;

  const where: Prisma.AppointmentWhereInput = { deletedAt: null };

  if (status && isAppointmentStatus(status)) {
    where.status = status;
  }

  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    if (!Number.isNaN(start.getTime())) {
      where.appointmentDate = {
        gte: start,
        lt: new Date(start.getTime() + 24 * 60 * 60 * 1000),
      };
    }
  }

  if (q) {
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { ownerName: { contains: q, mode: "insensitive" } },
      { petName: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
    include: {
      user: { select: { name: true } },
      pet: { select: { name: true } },
      veterinarian: { select: { name: true } },
      services: { include: { service: { select: { name: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointments"
        description="Schedule and track clinic visits."
        actions={
          <Link href="/admin/appointments/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New appointment
          </Link>
        }
      />

      <form
        method="get"
        className="flex flex-wrap items-end gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex min-w-40 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="q">
            Search
          </label>
          <Input id="q" name="q" defaultValue={q ?? ""} placeholder="Code, owner, pet" />
        </div>
        <div className="flex min-w-40 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="status">
            Status
          </label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {APPOINTMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {appointmentStatusLabel(value)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex min-w-40 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="date">
            Date
          </label>
          <Input id="date" name="date" type="date" defaultValue={date ?? ""} />
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
        <Link href="/admin/appointments" className={buttonVariants({ variant: "ghost" })}>
          Clear
        </Link>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Pet</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Veterinarian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableEmpty colSpan={8}>No appointments found.</TableEmpty>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/admin/appointments/${appointment.id}`}
                    className="hover:underline"
                  >
                    {appointment.code}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDate(appointment.appointmentDate)}
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {formatTime(appointment.appointmentTime)}
                  </span>
                </TableCell>
                <TableCell>
                  {appointment.user?.name ?? appointment.ownerName ?? "—"}
                </TableCell>
                <TableCell>
                  {appointment.pet?.name ?? appointment.petName ?? "—"}
                </TableCell>
                <TableCell className="max-w-48 truncate">
                  {appointment.services.length > 0
                    ? appointment.services
                        .map((item) => item.service.name)
                        .join(", ")
                    : "—"}
                </TableCell>
                <TableCell>{appointment.veterinarian?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(appointment.status)}>
                    {appointmentStatusLabel(appointment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/appointments/${appointment.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/appointments/${appointment.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    <form action={deleteAppointment}>
                      <input type="hidden" name="id" value={appointment.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
