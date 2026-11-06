import Link from "next/link";
import { Plus } from "lucide-react";

import { cancelOwnAppointment } from "@/lib/actions/appointments";
import { Badge, statusTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { appointmentStatusLabel } from "@/lib/clinic";
import { formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "My appointments" };

export default async function MyAppointmentsPage() {
  const user = await requirePetOwner();

  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
    include: {
      pet: { select: { name: true } },
      veterinarian: { select: { name: true } },
      services: { include: { service: { select: { name: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My appointments"
        description="Book a visit and track your upcoming schedule."
        actions={
          <Link href="/pet-owner/appointments/new" className={buttonVariants()}>
            <Plus className="size-4" />
            Book appointment
          </Link>
        }
      />

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="Book your first clinic visit and we'll take care of the rest."
          action={
            <Link
              href="/pet-owner/appointments/new"
              className={buttonVariants()}
            >
              Book an appointment
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {appointment.code}
                  </p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatDate(appointment.appointmentDate)} ·{" "}
                    {formatTime(appointment.appointmentTime)}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {appointment.pet?.name ?? appointment.petName ?? "Pet"}
                    {appointment.veterinarian
                      ? ` · ${appointment.veterinarian.name}`
                      : ""}
                  </p>
                </div>
                <Badge tone={statusTone(appointment.status)}>
                  {appointmentStatusLabel(appointment.status)}
                </Badge>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {appointment.services.length > 0
                  ? appointment.services
                      .map((item) => item.service.name)
                      .join(", ")
                  : "No services selected"}
              </p>

              {appointment.reason ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Reason: {appointment.reason}
                </p>
              ) : null}

              {["pending", "confirmed"].includes(appointment.status) ? (
                <form action={cancelOwnAppointment}>
                  <input type="hidden" name="id" value={appointment.id} />
                  <button
                    type="submit"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Cancel appointment
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
