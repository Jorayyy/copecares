import { ProductForm } from "../product-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();

  const categories = await prisma.productCategory.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New product" />
      <ProductForm categories={categories} />
    </div>
  );
}
