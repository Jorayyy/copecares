"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { errorMessage, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function saveSettings(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const updates: { key: string; value: string }[] = [];

  for (const [field, value] of formData.entries()) {
    if (!field.startsWith("setting:") || typeof value !== "string") continue;
    updates.push({ key: field.slice("setting:".length), value: value.trim() });
  }

  try {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.setting.update({
          where: { key: update.key },
          data: { value: update.value || null },
        }),
      ),
    );
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin", "layout");
  return { success: "Settings saved." };
}

const newSettingSchema = z.object({
  key: z
    .string()
    .min(2, "Key must be at least 2 characters.")
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only."),
  value: z.string().optional(),
  group: z.string().min(1, "Group is required."),
});

export async function createSetting(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = newSettingSchema.safeParse({
    key: formValue(formData, "newKey"),
    value: formValue(formData, "newValue"),
    group: formValue(formData, "newGroup") || "general",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  try {
    await prisma.setting.create({
      data: {
        key: parsed.data.key,
        value: parsed.data.value || null,
        group: parsed.data.group,
      },
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}
