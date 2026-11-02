import { SettingsForm } from "./settings-form";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await prisma.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Clinic profile, schedule, and point-of-sale defaults."
      />
      <SettingsForm
        settings={settings.map((setting) => ({
          id: setting.id,
          key: setting.key,
          value: setting.value,
          group: setting.group,
        }))}
      />
    </div>
  );
}
