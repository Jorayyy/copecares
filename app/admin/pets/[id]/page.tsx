import { notFound } from "next/navigation";

import { PetDetail } from "@/components/pet-detail";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Pet details" };

export default async function PetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const pet = await prisma.pet.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: {
      petCategory: { select: { name: true } },
      user: { select: { name: true, email: true, phone: true } },
      medicalRecords: {
        where: { deletedAt: null },
        orderBy: { recordDate: "desc" },
        include: { veterinarian: { select: { name: true } } },
      },
      vaccinations: { orderBy: { vaccinationDate: "desc" } },
      appointments: {
        where: { deletedAt: null },
        orderBy: { appointmentDate: "desc" },
      },
    },
  });

  if (!pet) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Pet details" />
      <PetDetail
        backHref="/admin/pets"
        editHref={`/admin/pets/${pet.id}/edit`}
        pet={pet}
      />
    </div>
  );
}
