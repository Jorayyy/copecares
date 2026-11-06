import { MedicalRecordForm } from "@/components/medical-record-form";
import { PageHeader } from "@/components/ui/page-header";
import { saveMedicalRecord } from "@/lib/actions/medical-records";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New medical record" };

function nowDateTimeInput() {
  const date = new Date();
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function NewMedicalRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ petId?: string; appointmentId?: string }>;
}) {
  const user = await requireAdmin();
  const { petId, appointmentId } = await searchParams;

  const [pets, appointments, veterinarians] = await Promise.all([
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
    prisma.appointment.findMany({
      where: { deletedAt: null },
      orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
      take: 100,
      select: {
        id: true,
        code: true,
        petId: true,
        pet: { select: { name: true } },
        petName: true,
      },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { slug: "veterinarian" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const petIdNumber = Number(petId ?? 0);
  const appointmentIdNumber = Number(appointmentId ?? 0);
  const defaultPetId =
    Number.isInteger(petIdNumber) && petIdNumber > 0 ? petIdNumber : undefined;
  const defaultAppointmentId =
    Number.isInteger(appointmentIdNumber) && appointmentIdNumber > 0
      ? appointmentIdNumber
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New medical record" />
      <MedicalRecordForm
        action={saveMedicalRecord}
        pets={pets.map((pet) => ({
          id: pet.id,
          name: pet.name,
          category: pet.petCategory.name,
          ownerName: pet.user.name,
        }))}
        appointments={appointments.map((appointment) => ({
          id: appointment.id,
          code: appointment.code,
          petId: appointment.petId,
          petName: appointment.pet?.name ?? appointment.petName ?? "Walk-in",
        }))}
        veterinarians={veterinarians}
        currentUserId={user.id}
        defaultPetId={defaultPetId}
        defaultAppointmentId={defaultAppointmentId}
        defaultRecordDate={nowDateTimeInput()}
        cancelHref="/admin/medical-records"
      />
    </div>
  );
}
