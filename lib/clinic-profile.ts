import { cache } from "react";

import { formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export type ClinicProfile = {
  clinicName: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  opening: string;
  closing: string;
  gallerySlots: number[];
};

const PROFILE_KEYS = [
  "clinic_name",
  "clinic_short_name",
  "clinic_email",
  "clinic_phone",
  "clinic_address",
  "opening_time",
  "closing_time",
] as const;

export const getClinicProfile = cache(async (): Promise<ClinicProfile> => {
  const [settingRows, galleryRows] = await Promise.all([
    prisma.setting.findMany({
      where: { key: { in: [...PROFILE_KEYS] } },
      select: { key: true, value: true },
    }),
    prisma.setting.findMany({
      where: {
        key: { startsWith: "clinic_gallery_" },
        value: { not: null },
      },
      select: { key: true },
    }),
  ]);

  const settings = new Map(
    settingRows.map((setting) => [setting.key, setting.value]),
  );

  const gallerySlots = galleryRows
    .map((row) => /^clinic_gallery_([1-6])$/.exec(row.key)?.[1])
    .filter((slot): slot is string => Boolean(slot))
    .map(Number)
    .sort((a, b) => a - b);

  return {
    clinicName:
      settings.get("clinic_name") ?? "Tacloban City Veterinary Office",
    shortName: settings.get("clinic_short_name") ?? "TCVO",
    email: settings.get("clinic_email") ?? "",
    phone: settings.get("clinic_phone") ?? "",
    address: settings.get("clinic_address") ?? "Tacloban City, Philippines",
    opening: formatTime(settings.get("opening_time") ?? "08:00"),
    closing: formatTime(settings.get("closing_time") ?? "17:00"),
    gallerySlots,
  };
});
