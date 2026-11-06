import { notFound } from "next/navigation";

import { MedicalRecordForm } from "@/components/medical-record-form";
import { PageHeader } from "@/components/ui/page-header";
import { saveMedicalRecord } from "@/lib/actions/medical-records";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit medical record" };

export default async function EditMedicalRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdmin();
  const { id } = await params;
  const recordId = Number(id);

  if (!Number.isInteger(recordId) || recordId <= 0) notFound();

  const [record, pets, veterinarians] = await Promise.all([
    prisma.medicalRecord.findFirst({
      where: { id: recordId, deletedAt: null },
    }),
    prisma.pet.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        petCategory: { select: { name: true } },
        user: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { slug: "veterinarian" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!record) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit medical record" />
      <MedicalRecordForm
        action={saveMedicalRecord}
        record={{
          ...record,
          weight: record.weight?.toString() ?? null,
          temperature: record.temperature?.toString() ?? null,
        }}
        pets={pets.map((pet) => ({
          id: pet.id,
          name: pet.name,
          category: pet.petCategory.name,
          ownerName: pet.user.name,
        }))}
        veterinarians={veterinarians}
        currentUserId={user.id}
        defaultRecordDate=""
        cancelHref={`/admin/medical-records/${record.id}`}
      />
    </div>
  );
}
