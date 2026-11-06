import Link from "next/link";
import { ReceiptText } from "lucide-react";

import { PosTerminal } from "@/components/pos-terminal";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { completeSale } from "@/lib/actions/pos";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Point of sale" };

export default async function PosPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  await requireAdmin();
  const { appointmentId } = await searchParams;

  const [products, services, owners, appointments] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        stockQuantity: true,
        productCategory: { select: { name: true } },
      },
    }),
    prisma.service.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, durationMinutes: true },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { slug: "pet_owner" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, phone: true },
    }),
    prisma.appointment.findMany({
      where: { deletedAt: null },
      orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
      take: 100,
      select: {
        id: true,
        code: true,
        userId: true,
        ownerName: true,
        petName: true,
        pet: { select: { name: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  const requestedAppointmentId = Number(appointmentId ?? 0);
  const defaultAppointmentId =
    Number.isInteger(requestedAppointmentId) && requestedAppointmentId > 0
      ? requestedAppointmentId
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Point of sale"
        description="Ring up products and services."
        actions={
          <Link
            href="/admin/pos/sales"
            className={buttonVariants({ variant: "outline" })}
          >
            <ReceiptText className="size-4" />
            Sales history
          </Link>
        }
      />

      <PosTerminal
        action={completeSale}
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.sellingPrice.toString(),
          stockQuantity: product.stockQuantity,
          category: product.productCategory?.name ?? "Uncategorized",
        }))}
        services={services.map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price.toString(),
          durationMinutes: service.durationMinutes,
        }))}
        owners={owners}
        appointments={appointments.map((appointment) => ({
          id: appointment.id,
          code: appointment.code,
          petName: appointment.pet?.name ?? appointment.petName ?? "Walk-in",
          ownerName: appointment.user?.name ?? appointment.ownerName ?? "Walk-in",
          userId: appointment.userId,
        }))}
        defaultAppointmentId={defaultAppointmentId}
      />
    </div>
  );
}
