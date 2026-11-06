import { prisma } from "@/lib/prisma";

export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: "clinic_logo" },
    select: { value: true },
  });

  const match = setting?.value
    ? /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(setting.value)
    : null;

  if (!match) {
    return new Response(null, { status: 404 });
  }

  const bytes = Buffer.from(match[2], "base64");

  return new Response(bytes, {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "no-store",
    },
  });
}
