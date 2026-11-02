import { ProductCategoryForm } from "../product-category-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New product category" };

export default async function NewProductCategoryPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New product category" />
      <ProductCategoryForm />
    </div>
  );
}
