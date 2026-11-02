import { PetForm } from "@/components/pet-form";
import { savePet } from "@/lib/actions/pets";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New pet" };

export default async function NewPetPage() {
  await requireAdmin();

  const [categories, owners] = await Promise.all([
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New pet" />
      <PetForm
        action={savePet}
        categories={categories}
        owners={owners}
        cancelHref="/admin/pets"
      />
    </div>
  );
}
