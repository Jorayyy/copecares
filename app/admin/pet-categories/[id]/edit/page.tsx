import { notFound } from "next/navigation";

import { PetCategoryForm } from "../../pet-category-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit pet category" };

export default async function EditPetCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const category = await prisma.petCategory.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit pet category" />
      <PetCategoryForm
        category={{
          id: category.id,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
