import Link from "next/link";
import { Plus } from "lucide-react";

import { deletePetCategory } from "@/lib/actions/pet-categories";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Pet categories" };

export default async function PetCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.petCategory.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { pets: { where: { deletedAt: null } }, services: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pet categories"
        description="Organize pet types and link them to services."
        actions={
          <Link
            href="/admin/pet-categories/new"
            className={buttonVariants()}
          >
            <Plus className="size-4" />
            New category
          </Link>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Pets</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableEmpty colSpan={6}>No pet categories yet.</TableEmpty>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                  {category.name}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description ?? "—"}
                </TableCell>
                <TableCell>{category._count.pets}</TableCell>
                <TableCell>{category._count.services}</TableCell>
                <TableCell>
                  <Badge tone={category.isActive ? "success" : "default"}>
                    {category.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/pet-categories/${category.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    <form action={deletePetCategory}>
                      <input type="hidden" name="id" value={category.id} />
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
