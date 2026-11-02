export const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  veterinarian: "/admin",
  staff: "/admin",
  pet_owner: "/pet-owner",
};

export const ADMIN_ROLES = ["admin", "veterinarian", "staff"];

export function homeForRole(role?: string | null) {
  return ROLE_HOME[role ?? ""] ?? "/login";
}
