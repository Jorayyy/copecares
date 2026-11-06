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

const LOGO_KEY = "clinic_logo";
const LOGO_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

export async function saveLogo(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  if (formValue(formData, "intent") === "remove") {
    try {
      await prisma.setting.updateMany({
        where: { key: LOGO_KEY },
        data: { value: null },
      });
    } catch (error) {
      return { error: errorMessage(error) };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Logo removed." };
  }

  const logo = formValue(formData, "logo");

  if (!logo) return { error: "Choose an image first." };
  if (!LOGO_PATTERN.test(logo)) {
    return { error: "Use a PNG, JPEG, or WebP image." };
  }
  if (logo.length > 1_200_000) {
    return { error: "Image is too large. Choose a smaller file." };
  }

  try {
    await prisma.setting.upsert({
      where: { key: LOGO_KEY },
      create: { key: LOGO_KEY, value: logo, group: "branding" },
      update: { value: logo, group: "branding" },
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: "Logo updated." };
}

const GALLERY_SLOTS = 6;
const GALLERY_KEY_PREFIX = "clinic_gallery_";
const GALLERY_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

function galleryTarget(formData: FormData) {
  const slot = Number(formValue(formData, "slot"));

  if (!Number.isInteger(slot) || slot < 1 || slot > GALLERY_SLOTS) {
    return null;
  }

  return { slot, key: `${GALLERY_KEY_PREFIX}${slot}` };
}

export async function saveGalleryPhoto(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const target = galleryTarget(formData);

  if (!target) return { error: "Invalid photo slot." };

  if (formValue(formData, "intent") === "remove") {
    try {
      await prisma.setting.updateMany({
        where: { key: target.key },
        data: { value: null },
      });
    } catch (error) {
      return { error: errorMessage(error) };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: `Photo ${target.slot} removed.` };
  }

  const photo = formValue(formData, "photo");

  if (!photo) return { error: "Choose an image first." };
  if (!GALLERY_PATTERN.test(photo)) {
    return { error: "Use a PNG, JPEG, or WebP image." };
  }
  if (photo.length > 2_500_000) {
    return { error: "Image is too large. Choose a smaller file." };
  }

  try {
    await prisma.setting.upsert({
      where: { key: target.key },
      create: { key: target.key, value: photo, group: "branding" },
      update: { value: photo, group: "branding" },
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: `Photo ${target.slot} updated.` };
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
