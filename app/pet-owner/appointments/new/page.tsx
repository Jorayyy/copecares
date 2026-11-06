import Link from "next/link";

import { OwnAppointmentForm } from "@/components/own-appointment-form";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { saveOwnAppointment } from "@/lib/actions/appointments";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "Book appointment" };

export default async function NewOwnAppointmentPage() {
  const user = await requirePetOwner();

  const [pets, services] = await Promise.all([
    prisma.pet.findMany({
      where: { userId: user.id, deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, breed: true },
    }),
    prisma.service.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, durationMinutes: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Book appointment" />

      {pets.length === 0 ? (
        <EmptyState
          title="Add a pet first"
          description="You need at least one pet profile before booking an appointment."
          action={
            <Link href="/pet-owner/pets/new" className={buttonVariants()}>
              Add a pet
            </Link>
          }
        />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services available"
          description="Clinic services are not configured yet. Please contact the clinic."
        />
      ) : (
        <OwnAppointmentForm
          action={saveOwnAppointment}
          pets={pets}
          services={services.map((service) => ({
            ...service,
            price: service.price.toString(),
          }))}
          cancelHref="/pet-owner/appointments"
        />
      )}
    </div>
  );
}
