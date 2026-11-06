import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import {
  deleteAppointment,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import {
  APPOINTMENT_STATUSES,
  appointmentStatusLabel,
} from "@/lib/clinic";
import { ageLabel, formatDate, formatPeso, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const appointmentId = Number(id);

  if (!Number.isInteger(appointmentId) || appointmentId <= 0) notFound();

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      pet: {
        select: {
          id: true,
          name: true,
          breed: true,
          birthDate: true,
          petCategory: { select: { name: true } },
        },
      },
      veterinarian: { select: { name: true } },
      petCategory: { select: { name: true } },
      services: {
        include: { service: { select: { name: true, price: true } } },
      },
      medicalRecords: {
        where: { deletedAt: null },
        orderBy: { recordDate: "desc" },
        select: { id: true, recordDate: true, diagnosis: true },
      },
      sales: {
        where: { deletedAt: null },
        select: { id: true, invoiceNumber: true, totalAmount: true, status: true },
      },
    },
  });

  if (!appointment) notFound();

  const total = appointment.services.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={appointment.code}
        description={`${formatDate(appointment.appointmentDate)} at ${formatTime(appointment.appointmentTime)}`}
        actions={
          <>
            <Link
              href={`/admin/appointments/${appointment.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
            <form action={deleteAppointment}>
              <input type="hidden" name="id" value={appointment.id} />
              <DeleteButton label="Delete" small={false} />
            </form>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visit details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Status">
              <Badge tone={statusTone(appointment.status)}>
                {appointmentStatusLabel(appointment.status)}
              </Badge>
            </Detail>
            <Detail label="Veterinarian">
              {appointment.veterinarian?.name ?? "Unassigned"}
            </Detail>
            <Detail label="Owner">
              {appointment.user?.name ?? appointment.ownerName ?? "—"}
            </Detail>
            <Detail label="Contact">
              {appointment.contact ?? appointment.user?.phone ?? "—"}
            </Detail>
            <Detail label="Email">
              {appointment.email ?? appointment.user?.email ?? "—"}
            </Detail>
            <Detail label="Address">{appointment.address ?? "—"}</Detail>
            <Detail label="Pet">
              {appointment.pet?.name ?? appointment.petName ?? "—"}
            </Detail>
            <Detail label="Breed">
              {appointment.pet?.breed ?? appointment.petBreed ?? "—"}
            </Detail>
            <Detail label="Category">
              {appointment.petCategory?.name ?? "—"}
            </Detail>
            <Detail label="Age">
              {appointment.pet?.birthDate
                ? ageLabel(appointment.pet.birthDate)
                : (appointment.petAge ?? "—")}
            </Detail>
            <Detail label="Reason" className="sm:col-span-2">
              {appointment.reason ?? "—"}
            </Detail>
            <Detail label="Notes" className="sm:col-span-2">
              {appointment.notes ?? "—"}
            </Detail>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update status</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateAppointmentStatus} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={appointment.id} />
              <Select name="status" defaultValue={appointment.status}>
                {APPOINTMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {appointmentStatusLabel(status)}
                  </option>
                ))}
              </Select>
              <Button type="submit" size="sm">
                Save status
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.services.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No services recorded.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {appointment.services.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span>{item.service.name}</span>
                  <span className="font-medium">
                    {formatPeso(item.price)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between py-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatPeso(total)}</span>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Medical records</CardTitle>
          </CardHeader>
          <CardContent>
            {appointment.medicalRecords.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No medical records linked yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {appointment.medicalRecords.map((record) => (
                  <li key={record.id}>
                    <Link
                      href={`/admin/medical-records/${record.id}`}
                      className="font-medium hover:underline"
                    >
                      {formatDate(record.recordDate)}
                    </Link>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {record.diagnosis ?? "No diagnosis"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {appointment.sales.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No sales linked yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {appointment.sales.map((sale) => (
                  <li key={sale.id} className="flex items-center justify-between">
                    <Link
                      href={`/admin/pos/sales/${sale.id}`}
                      className="font-mono text-xs hover:underline"
                    >
                      {sale.invoiceNumber}
                    </Link>
                    <span className="flex items-center gap-2">
                      {formatPeso(sale.totalAmount)}
                      <Badge tone={statusTone(sale.status)}>{sale.status}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}
