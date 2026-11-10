"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import {
  errorMessage,
  formBoolean,
  formValue,
  optionalValue,
} from "@/lib/form-utils";
import { resolveImageField } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  sku: z.string().optional(),
  description: z.string().optional(),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative."),
  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative."),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative."),
  reorderLevel: z.coerce.number().int().min(0, "Reorder level cannot be negative."),
  unit: z.string().min(1, "Unit is required."),
});

export async function saveProduct(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formValue(formData, "name"),
    sku: formValue(formData, "sku"),
    description: formValue(formData, "description"),
    costPrice: formValue(formData, "costPrice"),
    sellingPrice: formValue(formData, "sellingPrice"),
    stockQuantity: formValue(formData, "stockQuantity"),
    reorderLevel: formValue(formData, "reorderLevel"),
    unit: formValue(formData, "unit") || "piece",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const image = resolveImageField(formData);

  if (image.error) return { error: image.error };

  const id = Number(formValue(formData, "id") || 0);
  const productCategoryId = optionalValue(formData, "productCategoryId");
  const data = {
    name: parsed.data.name,
    sku: parsed.data.sku || null,
    description: parsed.data.description || null,
    costPrice: parsed.data.costPrice,
    sellingPrice: parsed.data.sellingPrice,
    stockQuantity: parsed.data.stockQuantity,
    reorderLevel: parsed.data.reorderLevel,
    unit: parsed.data.unit,
    isActive: formBoolean(formData, "isActive"),
    productCategoryId: productCategoryId ? Number(productCategoryId) : null,
    ...(image.value !== undefined ? { image: image.value } : {}),
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data });
    }
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/pos");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formValue(formData, "id"));

  if (id) {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/pos");
}
