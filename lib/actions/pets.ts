"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import {
  errorMessage,
  formBoolean,
  formDate,
  formValue,
} from "@/lib/form-utils";
import { resolveImageField } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePetOwner } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2, "Pet name must be at least 2 characters."),
  petCategoryId: z.coerce.number().int().positive("Select a pet category."),
  breed: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]),
  birthDate: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
  medicalNotes: z.string().optional(),
});

async function persistPet(
  formData: FormData,
  ownerId: number,
  redirectTo: string,
): Promise<ActionState> {
  const parsed = schema.safeParse({
    name: formValue(formData, "name"),
    petCategoryId: formValue(formData, "petCategoryId"),
    breed: formValue(formData, "breed"),
    gender: formValue(formData, "gender") || "unknown",
    birthDate: formValue(formData, "birthDate"),
    weight: formValue(formData, "weight"),
    color: formValue(formData, "color"),
    medicalNotes: formValue(formData, "medicalNotes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const weight = parsed.data.weight ? Number(parsed.data.weight) : null;

  if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
    return { error: "Weight must be a positive number." };
  }

  const image = resolveImageField(formData);

  if (image.error) return { error: image.error };

  const id = Number(formValue(formData, "id") || 0);
  const data = {
    userId: ownerId,
    petCategoryId: parsed.data.petCategoryId,
    name: parsed.data.name,
    breed: parsed.data.breed || null,
    gender: parsed.data.gender,
    birthDate: formDate(formData, "birthDate"),
    weight,
    color: parsed.data.color || null,
    medicalNotes: parsed.data.medicalNotes || null,
    isActive: formBoolean(formData, "isActive"),
    ...(image.value !== undefined ? { image: image.value } : {}),
  };

  try {
    if (id) {
      const existing = await prisma.pet.findFirst({
        where: { id, userId: ownerId, deletedAt: null },
        select: { id: true },
      });

      if (!existing) return { error: "Pet not found." };

      await prisma.pet.update({ where: { id }, data });
    } else {
      await prisma.pet.create({ data });
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/pets");
  revalidatePath("/pet-owner/pets");
  redirect(redirectTo);
}

export async function savePet(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const ownerId = Number(formValue(formData, "userId"));

  if (!ownerId) return { error: "Select a pet owner." };

  return persistPet(formData, ownerId, "/admin/pets");
}

export async function saveOwnPet(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requirePetOwner();

  return persistPet(formData, user.id, "/pet-owner/pets");
}

export async function deletePet(formData: FormData) {
  await requireAdmin();
  const id = Number(formValue(formData, "id"));

  if (id) {
    await prisma.pet.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  revalidatePath("/admin/pets");
}

export async function deleteOwnPet(formData: FormData) {
  const user = await requirePetOwner();
  const id = Number(formValue(formData, "id"));

  if (id) {
    await prisma.pet.updateMany({
      where: { id, userId: user.id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  revalidatePath("/pet-owner/pets");
}
