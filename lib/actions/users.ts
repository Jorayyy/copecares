"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { errorMessage, formBoolean, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").toLowerCase(),
  phone: z.string().optional(),
  address: z.string().optional(),
  roleId: z.coerce.number().int().positive("Select a role."),
  password: z.string().optional(),
});

export async function saveUser(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentUser = await requireAdmin();

  const parsed = schema.safeParse({
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    phone: formValue(formData, "phone"),
    address: formValue(formData, "address"),
    roleId: formValue(formData, "roleId"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const id = Number(formValue(formData, "id") || 0);
  const password = parsed.data.password;

  if (!id && (!password || password.length < 6)) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password && password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const isActive = formBoolean(formData, "isActive");

  if (id === currentUser.id && !isActive) {
    return { error: "You cannot deactivate your own account." };
  }

  const data = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    roleId: parsed.data.roleId,
    isActive,
    ...(password ? { password: await hash(password, 10) } : {}),
  };

  try {
    if (id) {
      await prisma.user.update({ where: { id }, data });
    } else {
      await prisma.user.create({ data: data as typeof data & { password: string } });
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deactivateUser(formData: FormData) {
  const currentUser = await requireAdmin();
  const id = Number(formValue(formData, "id"));

  if (!id || id === currentUser.id) return;

  await prisma.user.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/users");
}

export async function activateUser(formData: FormData) {
  await requireAdmin();
  const id = Number(formValue(formData, "id"));

  if (!id) return;

  await prisma.user.update({ where: { id }, data: { isActive: true } });
  revalidatePath("/admin/users");
}
