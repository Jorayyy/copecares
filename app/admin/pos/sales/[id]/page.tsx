import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { Badge, statusTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPeso } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function SalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const saleId = Number(id);

  if (!Number.isInteger(saleId) || saleId <= 0) notFound();

  const sale = await prisma.sale.findFirst({
    where: { id: saleId, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      cashier: { select: { name: true } },
      appointment: { select: { id: true, code: true } },
      items: { orderBy: { id: "asc" } },
    },
  });

  if (!sale) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={sale.invoiceNumber}
        description={formatDateTime(sale.createdAt)}
        actions={
          <>
            <Link
              href="/admin/pos/sales"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeft className="size-4" />
              Back to sales
            </Link>
            <Link href="/admin/pos" className={buttonVariants()}>
              <ShoppingCart className="size-4" />
              New sale
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sale details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Status">
              <Badge tone={statusTone(sale.status)}>{sale.status}</Badge>
            </Detail>
            <Detail label="Payment method">
              <span className="capitalize">{sale.paymentMethod}</span>
            </Detail>
            <Detail label="Customer">
              {sale.user?.name ?? sale.customerName ?? "Walk-in"}
            </Detail>
            <Detail label="Contact">
              {sale.user?.phone ?? sale.customerContact ?? "—"}
            </Detail>
            <Detail label="Cashier">{sale.cashier?.name ?? "—"}</Detail>
            <Detail label="Appointment">
              {sale.appointment ? (
                <Link
                  href={`/admin/appointments/${sale.appointment.id}`}
                  className="font-mono text-xs hover:underline"
                >
                  {sale.appointment.code}
                </Link>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Notes" className="sm:col-span-2">
              {sale.notes ?? "—"}
            </Detail>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <SummaryRow label="Subtotal" value={formatPeso(sale.subtotal)} />
            <SummaryRow label="Tax" value={formatPeso(sale.taxAmount)} />
            <SummaryRow
              label="Discount"
              value={formatPeso(sale.discountAmount)}
            />
            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
              <span>Total</span>
              <span>{formatPeso(sale.totalAmount)}</span>
            </div>
            <SummaryRow label="Amount paid" value={formatPeso(sale.amountPaid)} />
            <SummaryRow label="Change" value={formatPeso(sale.changeAmount)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          {sale.items.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No items recorded.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell className="capitalize">{item.itemType}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatPeso(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPeso(item.discount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPeso(item.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
