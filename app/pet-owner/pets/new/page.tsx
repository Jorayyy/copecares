import { PetForm } from "@/components/pet-form";
import { saveOwnPet } from "@/lib/actions/pets";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "Add pet" };

export default async function NewOwnPetPage() {
  await requirePetOwner();

  const categories = await prisma.petCategory.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add pet" />
      <PetForm
        action={saveOwnPet}
        cancelHref="/pet-owner/pets"
        categories={categories}
      />
    </div>
  );
}
