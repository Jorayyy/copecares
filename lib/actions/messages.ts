"use server";

import { revalidatePath } from "next/cache";

import { formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function markMessageRead(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  if (!id) return;

  await prisma.message.update({ where: { id }, data: { isRead: true } });

  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();

  const id = Number(formValue(formData, "id"));
  if (!id) return;

  await prisma.message.delete({ where: { id } });

  revalidatePath("/admin/messages");
}
