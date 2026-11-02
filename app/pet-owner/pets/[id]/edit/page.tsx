import { notFound } from "next/navigation";

import { PetForm } from "@/components/pet-form";
import { saveOwnPet } from "@/lib/actions/pets";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "Edit pet" };

export default async function EditOwnPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePetOwner();
  const { id } = await params;

  const [pet, categories] = await Promise.all([
    prisma.pet.findFirst({
      where: { id: Number(id), userId: user.id, deletedAt: null },
    }),
    prisma.petCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!pet) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${pet.name}`} />
      <PetForm
        action={saveOwnPet}
        cancelHref="/pet-owner/pets"
        categories={categories}
        pet={{
          id: pet.id,
          userId: pet.userId,
          petCategoryId: pet.petCategoryId,
          name: pet.name,
          breed: pet.breed,
          gender: pet.gender,
          birthDate: pet.birthDate,
          weight: pet.weight?.toString() ?? null,
          color: pet.color,
          medicalNotes: pet.medicalNotes,
          isActive: pet.isActive,
        }}
      />
    </div>
  );
}
