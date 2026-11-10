import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteOwnPet } from "@/lib/actions/pets";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Thumbnail } from "@/components/ui/thumbnail";
import { ageLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requirePetOwner } from "@/lib/session";

export const metadata = { title: "My pets" };

export default async function MyPetsPage() {
  const user = await requirePetOwner();

  const pets = await prisma.pet.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      petCategory: { select: { name: true } },
      vaccinations: {
        orderBy: { vaccinationDate: "desc" },
        take: 1,
        select: { vaccineName: true, nextDueDate: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My pets"
        description="Manage your pet profiles and view their records."
        actions={
          <Link href="/pet-owner/pets/new" className={buttonVariants()}>
            <Plus className="size-4" />
            Add pet
          </Link>
        }
      />

      {pets.length === 0 ? (
        <EmptyState
          title="No pets yet"
          description="Add your first pet to book appointments and keep track of their health records."
          action={
            <Link href="/pet-owner/pets/new" className={buttonVariants()}>
              Add your first pet
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Thumbnail
                    src={pet.image}
                    alt={pet.name}
                    className="size-12"
                  />
                  <div>
                    <Link
                      href={`/pet-owner/pets/${pet.id}`}
                      className="text-base font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {pet.name}
                    </Link>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {pet.petCategory.name} · {pet.breed ?? "Unknown breed"}
                    </p>
                  </div>
                </div>
                <Badge tone={pet.isActive ? "success" : "default"}>
                  {pet.isActive ? "active" : "inactive"}
                </Badge>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-zinc-500">Age</dt>
                  <dd>{ageLabel(pet.birthDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Weight</dt>
                  <dd>{pet.weight ? `${pet.weight.toString()} kg` : "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-zinc-500">Last vaccine</dt>
                  <dd>
                    {pet.vaccinations[0]
                      ? `${pet.vaccinations[0].vaccineName}`
                      : "No vaccines recorded"}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex items-center gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Link
                  href={`/pet-owner/pets/${pet.id}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  View
                </Link>
                <Link
                  href={`/pet-owner/pets/${pet.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Edit
                </Link>
                <form action={deleteOwnPet} className="ml-auto">
                  <input type="hidden" name="id" value={pet.id} />
                  <DeleteButton message="Remove this pet profile?" />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
