import { PetCategoryForm } from "../pet-category-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New pet category" };

export default async function NewPetCategoryPage() {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New pet category"
        description="Add a pet type such as dogs, cats, or birds."
      />
      <PetCategoryForm />
    </div>
  );
}
