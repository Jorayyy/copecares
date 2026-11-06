import { AppointmentForm } from "@/components/appointment-form";
import { PageHeader } from "@/components/ui/page-header";
import { saveAppointment } from "@/lib/actions/appointments";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New appointment" };

export default async function NewAppointmentPage() {
  await requireAdmin();

  const [categories, services, veterinarians, owners] = await Promise.all([
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New appointment" />
      <AppointmentForm
        action={saveAppointment}
        owners={owners}
        categories={categories}
        services={services.map((service) => ({
          ...service,
          price: service.price.toString(),
        }))}
        veterinarians={veterinarians}
        cancelHref="/admin/appointments"
      />
    </div>
  );
}
