import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { deleteMedicalRecord } from "@/lib/actions/medical-records";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
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
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Medical records" };

export default async function MedicalRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; petId?: string }>;
}) {
  await requireAdmin();
  const { q, petId } = await searchParams;

  const where: Prisma.MedicalRecordWhereInput = { deletedAt: null };

  if (petId) {
    const id = Number(petId);
    if (Number.isInteger(id) && id > 0) where.petId = id;
  }

  if (q) {
    where.OR = [
      { diagnosis: { contains: q, mode: "insensitive" } },
      { treatment: { contains: q, mode: "insensitive" } },
      { pet: { name: { contains: q, mode: "insensitive" } } },
      { pet: { user: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }

  const [records, pets] = await Promise.all([
    prisma.medicalRecord.findMany({
      where,
      orderBy: { recordDate: "desc" },
      include: {
        pet: {
          select: { id: true, name: true, user: { select: { name: true } } },
        },
        veterinarian: { select: { name: true } },
        _count: { select: { vaccinations: true } },
      },
    }),
    prisma.pet.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Medical records"
        description="Diagnoses, treatments, and vaccinations."
        actions={
          <Link href="/admin/medical-records/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New record
          </Link>
        }
      />

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
            placeholder="Pet, owner, diagnosis"
          />
        </div>
        <div className="flex min-w-40 flex-col gap-1">
          <label className="text-xs text-zinc-500 dark:text-zinc-400" htmlFor="petId">
            Pet
          </label>
          <Select id="petId" name="petId" defaultValue={petId ?? ""}>
            <option value="">All pets</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
        <Link
          href="/admin/medical-records"
          className={buttonVariants({ variant: "ghost" })}
        >
          Clear
        </Link>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Pet</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Veterinarian</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Vaccinations</TableHead>
            <TableHead>Next visit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableEmpty colSpan={8}>No medical records found.</TableEmpty>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.recordDate)}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/medical-records/${record.id}`}
                    className="font-medium hover:underline"
                  >
                    {record.pet.name}
                  </Link>
                </TableCell>
                <TableCell>{record.pet.user.name}</TableCell>
                <TableCell>{record.veterinarian?.name ?? "—"}</TableCell>
                <TableCell className="max-w-56 truncate">
                  {record.diagnosis ?? "—"}
                </TableCell>
                <TableCell>{record._count.vaccinations}</TableCell>
                <TableCell>
                  {record.nextVisitDate ? formatDate(record.nextVisitDate) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/medical-records/${record.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/medical-records/${record.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    <form action={deleteMedicalRecord}>
                      <input type="hidden" name="id" value={record.id} />
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
