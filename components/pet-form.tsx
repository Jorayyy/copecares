"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { toDateInput } from "@/lib/format";

type Pet = {
  id: number;
  userId: number;
  petCategoryId: number;
  name: string;
  breed: string | null;
  gender: string;
  birthDate: Date | null;
  weight: string | null;
  color: string | null;
  medicalNotes: string | null;
  image: string | null;
  isActive: boolean;
};

export function PetForm({
  action,
  pet,
  categories,
  owners,
  cancelHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  pet?: Pet;
  categories: { id: number; name: string }[];
  owners?: { id: number; name: string; email: string }[];
  cancelHref: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      {pet ? <input type="hidden" name="id" value={pet.id} /> : null}

      <ImageUpload name="image" label="Pet photo" initialImage={pet?.image} />

      {owners ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="userId">Owner</Label>
          <Select
            id="userId"
            name="userId"
            defaultValue={pet?.userId ?? ""}
            required
          >
            <option value="" disabled>
              Select owner
            </option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Pet name</Label>
          <Input id="name" name="name" defaultValue={pet?.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="petCategoryId">Category</Label>
          <Select
            id="petCategoryId"
            name="petCategoryId"
            defaultValue={pet?.petCategoryId ?? ""}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" name="breed" defaultValue={pet?.breed ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" name="gender" defaultValue={pet?.gender ?? "unknown"}>
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="birthDate">Birth date</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={pet?.birthDate ? toDateInput(pet.birthDate) : ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="0.01"
            defaultValue={pet?.weight ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" defaultValue={pet?.color ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="medicalNotes">Medical notes</Label>
        <Textarea
          id="medicalNotes"
          name="medicalNotes"
          defaultValue={pet?.medicalNotes ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={pet?.isActive ?? true}
          className="size-4 rounded border-zinc-300 text-dusk-600"
        />
        Active
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{pet ? "Save changes" : "Add pet"}</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
