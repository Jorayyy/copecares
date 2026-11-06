import { notFound } from "next/navigation";

import { AppointmentForm } from "@/components/appointment-form";
import { PageHeader } from "@/components/ui/page-header";
import { saveAppointment } from "@/lib/actions/appointments";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit appointment" };

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const appointmentId = Number(id);

  if (!Number.isInteger(appointmentId) || appointmentId <= 0) notFound();

  const [appointment, categories, services, veterinarians, owners] =
    await Promise.all([
      prisma.appointment.findFirst({
        where: { id: appointmentId, deletedAt: null },
        include: { services: { select: { serviceId: true } } },
      }),
      prisma.petCategory.findMany({
        where: { deletedAt: null, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.service.findMany({
        where: { deletedAt: null, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, price: true, durationMinutes: true },
      }),
      prisma.user.findMany({
        where: { isActive: true, role: { slug: "veterinarian" } },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.user.findMany({
        where: { isActive: true, role: { slug: "pet_owner" } },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          pets: {
            where: { deletedAt: null },
            orderBy: { name: "asc" },
            select: { id: true, name: true, breed: true, petCategoryId: true },
          },
        },
      }),
    ]);

  if (!appointment) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${appointment.code}`} />
      <AppointmentForm
        action={saveAppointment}
        appointment={appointment}
        owners={owners}
        categories={categories}
        services={services.map((service) => ({
          ...service,
          price: service.price.toString(),
        }))}
        veterinarians={veterinarians}
        cancelHref={`/admin/appointments/${appointment.id}`}
      />
    </div>
  );
}
