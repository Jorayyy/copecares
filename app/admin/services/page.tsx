import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteService } from "@/lib/actions/services";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPeso } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { petCategories: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Services"
        description="Clinic services, pricing, and duration."
        actions={
          <Link href="/admin/services/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New service
          </Link>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Pet categories</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableEmpty colSpan={6}>No services yet.</TableEmpty>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {service.name}
                  </p>
                  <p className="max-w-sm truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {service.description ?? "No description"}
                  </p>
                </TableCell>
                <TableCell>{formatPeso(service.price)}</TableCell>
                <TableCell>{service.durationMinutes} min</TableCell>
                <TableCell className="max-w-xs">
                  {service.petCategories.length
                    ? service.petCategories.map((category) => category.name).join(", ")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge tone={service.isActive ? "success" : "default"}>
                    {service.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={service.id} />
                      <DeleteButton />
                    </form>
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
