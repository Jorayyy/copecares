import { ServiceForm } from "../service-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin();

  const categories = await prisma.petCategory.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New service" description="Add a clinic service." />
      <ServiceForm categories={categories} />
    </div>
  );
}
