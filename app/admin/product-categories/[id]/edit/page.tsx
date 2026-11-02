import { notFound } from "next/navigation";

import { ProductCategoryForm } from "../../product-category-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit product category" };

export default async function EditProductCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const category = await prisma.productCategory.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit product category" />
      <ProductCategoryForm
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
