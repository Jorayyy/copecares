"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { errorMessage, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2, "Enter your name."),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function updateOwnProfile(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = schema.safeParse({
    name: formValue(formData, "name"),
    phone: formValue(formData, "phone"),
    address: formValue(formData, "address"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
      },
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/profile");
  revalidatePath("/pet-owner/profile");
  revalidatePath("/admin");
  revalidatePath("/pet-owner");

  return { success: "Profile updated." };
}
