import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "My profile" };

export default async function AdminProfilePage() {
  const user = await requireAdmin();

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      address: true,
      role: { select: { name: true } },
    },
  });

  if (!profile) redirect("/login");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My profile"
        description="Update the details shown across the clinic system."
      />
      <ProfileForm
        profile={{
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          role: profile.role?.name ?? user.role,
        }}
      />
    </div>
  );
}
