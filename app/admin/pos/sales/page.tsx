import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Badge, statusTone } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPeso } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Sales" };

const SALE_STATUSES = ["completed", "pending", "refunded", "cancelled"] as const;

function startOfToday() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function startOfMonth() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    from?: string;
    to?: string;
  }>;
}) {
  await requireAdmin();
  const { status, q, from, to } = await searchParams;

  const where: Prisma.SaleWhereInput = { deletedAt: null };

  if (status && (SALE_STATUSES as readonly string[]).includes(status)) {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { invoiceNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const createdAtFilter: { gte?: Date; lte?: Date } = {};

  if (from) {
    const start = new Date(`${from}T00:00:00.000Z`);
    if (!Number.isNaN(start.getTime())) createdAtFilter.gte = start;
  }

  if (to) {
    const end = new Date(`${to}T23:59:59.999Z`);
    if (!Number.isNaN(end.getTime())) createdAtFilter.lte = end;
  }

  if (createdAtFilter.gte || createdAtFilter.lte) {
    where.createdAt = createdAtFilter;
  }

  const [sales, todayTotal, monthTotal] = await Promise.all([
    prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        cashier: { select: { name: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.sale.aggregate({
      where: {
        deletedAt: null,
        status: "completed",
        createdAt: { gte: startOfToday() },
      },
      _sum: { totalAmount: true },
    }),
    prisma.sale.aggregate({
      where: {
        deletedAt: null,
        status: "completed",
        createdAt: { gte: startOfMonth() },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sales"
        description="Completed transactions and receipts."
        actions={
          <Link href="/admin/pos" className={buttonVariants()}>
            <ShoppingCart className="size-4" />
            New sale
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatPeso(todayTotal._sum.totalAmount ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              This month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatPeso(monthTotal._sum.totalAmount ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{sales.length}</p>
          </CardContent>
        </Card>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex min-w-48 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="q">
            Search
          </label>
          <Input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Invoice or customer"
          />
        </div>
        <div className="flex min-w-36 flex-col gap-1">
          <label
            className="text-xs text-zinc-500 dark:text-zinc-400"
            htmlFor="status"
          >
            Status
          </label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {SALE_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex min-w-36 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="from">
            From
          </label>
          <Input id="from" name="from" type="date" defaultValue={from ?? ""} />
        </div>
        <div className="flex min-w-36 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="to">
            To
          </label>
          <Input id="to" name="to" type="date" defaultValue={to ?? ""} />
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
        <Link
          href="/admin/pos/sales"
          className={buttonVariants({ variant: "ghost" })}
        >
          Clear
        </Link>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Cashier</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableEmpty colSpan={9}>No sales found.</TableEmpty>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/admin/pos/sales/${sale.id}`}
                    className="hover:underline"
                  >
                    {sale.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                <TableCell>
                  {sale.user?.name ?? sale.customerName ?? "Walk-in"}
                </TableCell>
                <TableCell>{sale.cashier?.name ?? "—"}</TableCell>
                <TableCell>{sale._count.items}</TableCell>
                <TableCell className="font-medium">
                  {formatPeso(sale.totalAmount)}
                </TableCell>
                <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                <TableCell>
                  <Badge tone={statusTone(sale.status)}>{sale.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/pos/sales/${sale.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      View
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
