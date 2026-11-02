"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveService } from "@/lib/actions/services";
import type { ActionState } from "@/lib/action-state";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

type Service = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  durationMinutes: number;
  isActive: boolean;
  categoryIds: number[];
};

export function ServiceForm({
  service,
  categories,
}: {
  service?: Service;
  categories: { id: number; name: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveService,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={service?.name} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={service?.description ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (PHP)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={service?.price ?? "0"}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="5"
            step="5"
            defaultValue={service?.durationMinutes ?? 30}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Available for pet categories</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input
                type="checkbox"
                name="petCategoryIds"
                value={category.id}
                defaultChecked={service?.categoryIds.includes(category.id)}
                className="size-4 rounded border-zinc-300 text-emerald-600"
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={service?.isActive ?? true}
          className="size-4 rounded border-zinc-300 text-emerald-600"
        />
        Active
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{service ? "Save changes" : "Create service"}</SubmitButton>
        <Link
          href="/admin/services"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
