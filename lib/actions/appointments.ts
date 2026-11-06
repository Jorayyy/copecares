"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { isAppointmentStatus } from "@/lib/clinic";
import { nextAppointmentCode } from "@/lib/codes";
import { errorMessage, formIds, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePetOwner } from "@/lib/session";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid appointment time.");

function optionalId(formData: FormData, key: string) {
  const value = formValue(formData, key);
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function findServices(ids: number[]) {
  if (ids.length === 0) return [];
  return prisma.service.findMany({
    where: { id: { in: ids }, deletedAt: null },
    select: { id: true, price: true },
  });
}

type AdminInput = {
  userId?: number;
  petId?: number;
  veterinarianId?: number;
  petCategoryId: number;
  ownerName: string;
  contact: string;
  email?: string;
  address?: string;
  petName: string;
  petBreed?: string;
  petAge?: string;
  appointmentDate: Date;
  appointmentTime: string;
  reason?: string;
  notes?: string;
  status: string;
  services: number[];
};

async function readAdminInput(
  formData: FormData,
): Promise<AdminInput | { error: string }> {
  const userId = optionalId(formData, "userId");
  const petId = optionalId(formData, "petId");
  const veterinarianId = optionalId(formData, "veterinarianId");
  let petCategoryId = optionalId(formData, "petCategoryId");
  let ownerName = formValue(formData, "ownerName");
  let contact = formValue(formData, "contact");
  let email = formValue(formData, "email");
  let petName = formValue(formData, "petName");
  let petBreed: string | undefined =
    formValue(formData, "petBreed") || undefined;
  const petAge = formValue(formData, "petAge");

  const date = parseDate(formValue(formData, "appointmentDate"));
  if (!date) return { error: "Choose a valid appointment date." };

  const time = formValue(formData, "appointmentTime");
  const parsedTime = timeSchema.safeParse(time);
  if (!parsedTime.success) {
    return { error: parsedTime.error.issues[0]?.message ?? "Choose a valid time." };
  }

  const services = formIds(formData, "services");
  if (services.length === 0) return { error: "Select at least one service." };

  if (userId) {
    const user = await prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: { name: true, email: true, phone: true },
    });
    if (!user) return { error: "Pet owner not found." };
    ownerName = ownerName || user.name;
    contact = contact || user.phone || user.email;
    email = email || user.email;
  }

  if (petId) {
    const pet = await prisma.pet.findFirst({
      where: { id: petId, deletedAt: null },
      select: { userId: true, petCategoryId: true, name: true, breed: true },
    });
    if (!pet) return { error: "Pet not found." };
    if (userId && pet.userId !== userId) {
      return { error: "That pet belongs to another owner." };
    }
    petName = petName || pet.name;
    petBreed = petBreed || pet.breed || undefined;
    petCategoryId = petCategoryId ?? pet.petCategoryId;
  }

  if (!petCategoryId) return { error: "Select a pet category." };
  if (!ownerName) return { error: "Enter the owner's name." };
  if (!contact) return { error: "Enter a contact number." };
  if (!petName) return { error: "Enter the pet's name." };

  return {
    userId,
    petId,
    veterinarianId,
    petCategoryId,
    ownerName,
    contact,
    email: email || undefined,
    address: formValue(formData, "address") || undefined,
    petName,
    petBreed: petBreed || undefined,
    petAge: petAge || undefined,
    appointmentDate: date,
    appointmentTime: time,
    reason: formValue(formData, "reason") || undefined,
    notes: formValue(formData, "notes") || undefined,
    status: formValue(formData, "status") || "pending",
    services,
  };
}

export async function saveAppointment(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const input = await readAdminInput(formData);
  if ("error" in input) return { error: input.error };

  if (!isAppointmentStatus(input.status)) {
    return { error: "Choose a valid appointment status." };
  }

  const services = await findServices(input.services);
  if (services.length !== input.services.length) {
    return { error: "One or more selected services are unavailable." };
  }

  const id = Number(formValue(formData, "id") || 0);

  try {
    await prisma.$transaction(async (tx) => {
      if (id) {
        await tx.appointment.update({
          where: { id },
          data: {
            userId: input.userId ?? null,
            petId: input.petId ?? null,
            veterinarianId: input.veterinarianId ?? null,
            petCategoryId: input.petCategoryId,
            ownerName: input.ownerName,
            contact: input.contact,
            email: input.email ?? null,
            address: input.address ?? null,
            petName: input.petName,
            petBreed: input.petBreed ?? null,
            petAge: input.petAge ?? null,
            appointmentDate: input.appointmentDate,
            appointmentTime: input.appointmentTime,
            reason: input.reason ?? null,
            notes: input.notes ?? null,
            status: input.status,
          },
        });

        await tx.appointmentService.deleteMany({ where: { appointmentId: id } });
        await tx.appointmentService.createMany({
          data: services.map((service) => ({
            appointmentId: id,
            serviceId: service.id,
            price: service.price,
          })),
        });
        return;
      }

      const code = await nextAppointmentCode();
      const appointment = await tx.appointment.create({
        data: {
          code,
          userId: input.userId ?? null,
          petId: input.petId ?? null,
          veterinarianId: input.veterinarianId ?? null,
          petCategoryId: input.petCategoryId,
          ownerName: input.ownerName,
          contact: input.contact,
          email: input.email ?? null,
          address: input.address ?? null,
          petName: input.petName,
          petBreed: input.petBreed ?? null,
          petAge: input.petAge ?? null,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          reason: input.reason ?? null,
          notes: input.notes ?? null,
          status: input.status,
        },
      });

      await tx.appointmentService.createMany({
        data: services.map((service) => ({
          appointmentId: appointment.id,
          serviceId: service.id,
          price: service.price,
        })),
      });
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  redirect("/admin/appointments");
}

export async function updateAppointmentStatus(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  const status = formValue(formData, "status");
  if (!id || !isAppointmentStatus(status)) return;

  await prisma.appointment.update({ where: { id }, data: { status } });

  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin");
}

export async function deleteAppointment(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  if (id) {
    await prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  redirect("/admin/appointments");
}

export async function saveOwnAppointment(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requirePetOwner();

  const petId = optionalId(formData, "petId");
  if (!petId) return { error: "Select one of your pets." };

  const [pet, owner] = await Promise.all([
    prisma.pet.findFirst({
      where: { id: petId, userId: user.id, deletedAt: null },
      select: {
        id: true,
        name: true,
        breed: true,
        petCategoryId: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, phone: true },
    }),
  ]);

  if (!pet || !owner) return { error: "Select one of your pets." };

  const date = parseDate(formValue(formData, "appointmentDate"));
  if (!date) return { error: "Choose a valid appointment date." };

  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
  if (date < today) return { error: "Choose today or a future date." };

  const time = formValue(formData, "appointmentTime");
  const parsedTime = timeSchema.safeParse(time);
  if (!parsedTime.success) {
    return { error: parsedTime.error.issues[0]?.message ?? "Choose a valid time." };
  }

  const services = formIds(formData, "services");
  if (services.length === 0) return { error: "Select at least one service." };

  const serviceRows = await findServices(services);
  if (serviceRows.length !== services.length) {
    return { error: "One or more selected services are unavailable." };
  }

  try {
    const code = await nextAppointmentCode();
    await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          code,
          userId: user.id,
          petId: pet.id,
          ownerName: owner.name,
          contact: owner.phone || owner.email,
          email: owner.email,
          petName: pet.name,
          petBreed: pet.breed,
          petCategoryId: pet.petCategoryId,
          appointmentDate: date,
          appointmentTime: time,
          reason: formValue(formData, "reason") || null,
          status: "pending",
        },
      });

      await tx.appointmentService.createMany({
        data: serviceRows.map((service) => ({
          appointmentId: appointment.id,
          serviceId: service.id,
          price: service.price,
        })),
      });
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/pet-owner/appointments");
  revalidatePath("/pet-owner");
  redirect("/pet-owner/appointments");
}

export async function cancelOwnAppointment(formData: FormData) {
  const user = await requirePetOwner();

  const id = Number(formValue(formData, "id"));
  if (!id) return;

  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      deletedAt: null,
      OR: [{ userId: user.id }, { pet: { userId: user.id } }],
    },
    select: { id: true, status: true },
  });

  if (!appointment) return;
  if (!["pending", "confirmed"].includes(appointment.status)) return;

  await prisma.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  revalidatePath("/pet-owner/appointments");
  revalidatePath(`/pet-owner/appointments/${id}`);
  revalidatePath("/pet-owner");
}
