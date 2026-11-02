import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ADMIN_ROLES, homeForRole } from "@/lib/auth-routes";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();

  if (!session?.user?.id) return null;

  return {
    id: Number(session.user.id),
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();

  if (!ADMIN_ROLES.includes(user.role)) {
    redirect(homeForRole(user.role));
  }

  return user;
}

export async function requirePetOwner(): Promise<SessionUser> {
  const user = await requireUser();

  if (user.role !== "pet_owner") {
    redirect(homeForRole(user.role));
  }

  return user;
}
