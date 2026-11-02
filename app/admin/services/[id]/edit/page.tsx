import { notFound } from "next/navigation";

import { ServiceForm } from "../../service-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [service, categories] = await Promise.all([
    prisma.service.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: { petCategories: { select: { id: true } } },
    }),
    prisma.petCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!service) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit service" />
      <ServiceForm
        categories={categories}
        service={{
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          durationMinutes: service.durationMinutes,
          isActive: service.isActive,
          categoryIds: service.petCategories.map((category) => category.id),
        }}
      />
    </div>
  );
}
