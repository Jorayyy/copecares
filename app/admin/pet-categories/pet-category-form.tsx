"use client";

import Link from "next/link";
import { useActionState } from "react";

import { savePetCategory } from "@/lib/actions/pet-categories";
import type { ActionState } from "@/lib/action-state";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";

type Category = {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
};

export function PetCategoryForm({ category }: { category?: Category }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    savePetCategory,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={category?.isActive ?? true}
          className="size-4 rounded border-zinc-300 text-emerald-600"
        />
        Active
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{category ? "Save changes" : "Create category"}</SubmitButton>
        <Link
          href="/admin/pet-categories"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
