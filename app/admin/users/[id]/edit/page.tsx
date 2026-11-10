import { notFound } from "next/navigation";

import { UserForm } from "../../user-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Edit user" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await requireAdmin();
  const { id } = await params;

  const [user, roles] = await Promise.all([
    prisma.user.findUnique({ where: { id: Number(id) } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!user) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Edit user" />
      <UserForm
        isSelf={user.id === currentUser.id}
        roles={roles.map((role) => ({ id: role.id, name: role.name }))}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          roleId: user.roleId,
          isActive: user.isActive,
        }}
      />
    </div>
  );
}
