"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { errorMessage, formDateTime, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

type VaccinationInput = {
  vaccineName: string;
  vaccinationDate: Date;
  nextDueDate: Date | null;
  batchNumber: string | null;
  notes: string | null;
};

function optionalId(formData: FormData, key: string) {
  const value = formValue(formData, key);
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function optionalNumber(formData: FormData, key: string) {
  const value = formValue(formData, key);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function readVaccinations(formData: FormData) {
  const raw = formValue(formData, "vaccinations");
  if (!raw) return [] as VaccinationInput[];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [] as VaccinationInput[];
  }

  if (!Array.isArray(parsed)) return [] as VaccinationInput[];

  const rows: VaccinationInput[] = [];

  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const vaccineName =
      typeof record.vaccineName === "string" ? record.vaccineName.trim() : "";
    if (!vaccineName) continue;

    const vaccinationDate =
      typeof record.vaccinationDate === "string" && record.vaccinationDate
        ? new Date(record.vaccinationDate)
        : null;
    if (!vaccinationDate || Number.isNaN(vaccinationDate.getTime())) continue;

    const nextDueDate =
      typeof record.nextDueDate === "string" && record.nextDueDate
        ? new Date(record.nextDueDate)
        : null;

    rows.push({
      vaccineName,
      vaccinationDate,
      nextDueDate:
        nextDueDate && !Number.isNaN(nextDueDate.getTime()) ? nextDueDate : null,
      batchNumber:
        typeof record.batchNumber === "string" && record.batchNumber.trim()
          ? record.batchNumber.trim()
          : null,
      notes:
        typeof record.notes === "string" && record.notes.trim()
          ? record.notes.trim()
          : null,
    });
  }

  return rows;
}

export async function saveMedicalRecord(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();

  const petId = optionalId(formData, "petId");
  if (!petId) return { error: "Select a pet." };

  const pet = await prisma.pet.findFirst({
    where: { id: petId, deletedAt: null },
    select: { id: true },
  });
  if (!pet) return { error: "Pet not found." };

  const appointmentId = optionalId(formData, "appointmentId");
  if (appointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, deletedAt: null },
      select: { id: true, petId: true },
    });
    if (!appointment) return { error: "Appointment not found." };
    if (appointment.petId && appointment.petId !== petId) {
      return { error: "That appointment belongs to another pet." };
    }
  }

  const recordDate = formDateTime(formData, "recordDate");
  if (!recordDate || Number.isNaN(recordDate.getTime())) {
    return { error: "Choose a valid record date." };
  }

  const nextVisitDate = formDateTime(formData, "nextVisitDate");
  if (nextVisitDate && Number.isNaN(nextVisitDate.getTime())) {
    return { error: "Choose a valid next visit date." };
  }

  const veterinarianId = optionalId(formData, "veterinarianId") ?? user.id;

  const data = {
    petId,
    appointmentId: appointmentId ?? null,
    veterinarianId,
    recordDate,
    diagnosis: formValue(formData, "diagnosis") || null,
    treatment: formValue(formData, "treatment") || null,
    prescription: formValue(formData, "prescription") || null,
    weight: optionalNumber(formData, "weight"),
    temperature: optionalNumber(formData, "temperature"),
    notes: formValue(formData, "notes") || null,
    nextVisitDate: nextVisitDate ?? null,
  };

  const id = Number(formValue(formData, "id") || 0);
  const vaccinations = id ? [] : readVaccinations(formData);

  try {
    if (id) {
      await prisma.medicalRecord.update({ where: { id }, data });
    } else {
      await prisma.$transaction(async (tx) => {
        const record = await tx.medicalRecord.create({ data });
        if (vaccinations.length > 0) {
          await tx.vaccination.createMany({
            data: vaccinations.map((vaccination) => ({
              petId,
              medicalRecordId: record.id,
              ...vaccination,
            })),
          });
        }
      });
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/medical-records");
  revalidatePath("/admin");
  if (appointmentId) revalidatePath(`/admin/appointments/${appointmentId}`);
  redirect("/admin/medical-records");
}

export async function addVaccination(formData: FormData) {
  await requireAdmin();

  const medicalRecordId = Number(formValue(formData, "medicalRecordId"));
  if (!medicalRecordId) return;

  const record = await prisma.medicalRecord.findFirst({
    where: { id: medicalRecordId, deletedAt: null },
    select: { id: true, petId: true },
  });
  if (!record) return;

  const vaccineName = formValue(formData, "vaccineName");
  if (!vaccineName) return;

  const vaccinationDate = formDateTime(formData, "vaccinationDate");
  if (!vaccinationDate || Number.isNaN(vaccinationDate.getTime())) return;

  const nextDueDate = formDateTime(formData, "nextDueDate");

  await prisma.vaccination.create({
    data: {
      petId: record.petId,
      medicalRecordId: record.id,
      vaccineName,
      vaccinationDate,
      nextDueDate:
        nextDueDate && !Number.isNaN(nextDueDate.getTime()) ? nextDueDate : null,
      batchNumber: formValue(formData, "batchNumber") || null,
      notes: formValue(formData, "notes") || null,
    },
  });

  revalidatePath(`/admin/medical-records/${record.id}`);
  revalidatePath("/admin/medical-records");
}

export async function deleteVaccination(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  const medicalRecordId = Number(formValue(formData, "medicalRecordId"));
  if (!id) return;

  await prisma.vaccination.delete({ where: { id } });

  if (medicalRecordId) {
    revalidatePath(`/admin/medical-records/${medicalRecordId}`);
  }
  revalidatePath("/admin/medical-records");
}

export async function deleteMedicalRecord(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  if (id) {
    await prisma.medicalRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  revalidatePath("/admin/medical-records");
  revalidatePath("/admin");
  redirect("/admin/medical-records");
}
