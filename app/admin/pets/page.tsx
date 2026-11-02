import Link from "next/link";
import { Plus } from "lucide-react";

import { deletePet } from "@/lib/actions/pets";
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
import { ageLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Pets" };

export default async function PetsPage() {
  await requireAdmin();

  const pets = await prisma.pet.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      user: { select: { name: true, email: true } },
      petCategory: { select: { name: true } },
      _count: {
        select: {
          appointments: { where: { deletedAt: null } },
          medicalRecords: { where: { deletedAt: null } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pets"
        description="All registered patients and their owners."
        actions={
          <Link href="/admin/pets/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New pet
          </Link>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pet</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.length === 0 ? (
            <TableEmpty colSpan={7}>No pets registered yet.</TableEmpty>
          ) : (
            pets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell>
                  <Link
                    href={`/admin/pets/${pet.id}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    {pet.name}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {pet.breed ?? "Unknown breed"}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{pet.user.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {pet.user.email}
                  </p>
                </TableCell>
                <TableCell>{pet.petCategory.name}</TableCell>
                <TableCell>{ageLabel(pet.birthDate)}</TableCell>
                <TableCell>{pet._count.medicalRecords}</TableCell>
                <TableCell>
                  <Badge tone={pet.isActive ? "success" : "default"}>
                    {pet.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/pets/${pet.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/pets/${pet.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    <form action={deletePet}>
                      <input type="hidden" name="id" value={pet.id} />
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
