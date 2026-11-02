"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { errorMessage, formBoolean, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
});

export async function saveProductCategory(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formValue(formData, "name"),
    description: formValue(formData, "description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const id = Number(formValue(formData, "id") || 0);
  const data = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    isActive: formBoolean(formData, "isActive"),
  };

  try {
    if (id) {
      await prisma.productCategory.update({ where: { id }, data });
    } else {
      await prisma.productCategory.create({ data });
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/product-categories");
  redirect("/admin/product-categories");
}

export async function deleteProductCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formValue(formData, "id"));

  if (id) {
    await prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  revalidatePath("/admin/product-categories");
}
