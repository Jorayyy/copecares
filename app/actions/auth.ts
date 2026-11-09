"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AuthState = { error?: string } | undefined;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .max(20, "Contact number is too long.")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must contain a letter.")
      .regex(/[0-9]/, "Password must contain a number."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    consent: z
      .string()
      .refine(
        (value) => value === "on",
        "Please accept the Privacy Notice and Terms of Use.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function safeCallbackUrl(value: FormDataEntryValue | null) {
  const url = typeof value === "string" ? value : "";
  return url.startsWith("/") && !url.startsWith("//") ? url : "/";
}

export async function loginAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function registerAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const role = await prisma.role.upsert({
    where: { slug: "pet_owner" },
    update: {},
    create: {
      name: "Pet Owner",
      slug: "pet_owner",
      description: "Pet owner with access to their pets and appointments",
    },
  });

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: await hash(parsed.data.password, 10),
      roleId: role.id,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/pet-owner",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but sign in failed. Try logging in." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
