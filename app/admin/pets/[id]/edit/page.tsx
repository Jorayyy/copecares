import { notFound } from "next/navigation";

import { PetForm } from "@/components/pet-form";
import { savePet } from "@/lib/actions/pets";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit pet" };

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [pet, categories, owners] = await Promise.all([
    prisma.pet.findFirst({ where: { id: Number(id), deletedAt: null } }),
    prisma.petCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { slug: "pet_owner" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  if (!pet) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${pet.name}`} />
      <PetForm
        action={savePet}
        cancelHref="/admin/pets"
        categories={categories}
        owners={owners}
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
          image: pet.image,
          isActive: pet.isActive,
        }}
      />
    </div>
  );
}
