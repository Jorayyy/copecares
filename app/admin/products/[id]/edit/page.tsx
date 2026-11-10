import { notFound } from "next/navigation";

import { ProductForm } from "../../product-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({ where: { id: Number(id), deletedAt: null } }),
    prisma.productCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit product" />
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          costPrice: product.costPrice.toString(),
          sellingPrice: product.sellingPrice.toString(),
          stockQuantity: product.stockQuantity,
          reorderLevel: product.reorderLevel,
          unit: product.unit,
          image: product.image,
          isActive: product.isActive,
          productCategoryId: product.productCategoryId,
        }}
      />
    </div>
  );
}
