import { notFound } from "next/navigation";

import { PetDetail } from "@/components/pet-detail";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "Pet details" };

export default async function OwnPetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePetOwner();
  const { id } = await params;

  const pet = await prisma.pet.findFirst({
    where: { id: Number(id), userId: user.id, deletedAt: null },
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
        backHref="/pet-owner/pets"
        editHref={`/pet-owner/pets/${pet.id}/edit`}
        pet={pet}
      />
    </div>
  );
}
