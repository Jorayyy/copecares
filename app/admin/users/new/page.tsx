import { UserForm } from "../user-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "New user" };

export default async function NewUserPage() {
  await requireAdmin();

  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New user" />
      <UserForm roles={roles.map((role) => ({ id: role.id, name: role.name }))} />
    </div>
  );
}
