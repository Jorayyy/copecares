"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { updateOwnProfile } from "@/lib/actions/profile";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateOwnProfile,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={profile.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} readOnly disabled />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={profile.role} readOnly disabled />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          defaultValue={profile.address ?? ""}
        />
      </div>

      <FormError message={state?.error} />
      {state?.success ? (
        <p className="rounded-md bg-dusk-50 px-3 py-2 text-sm text-dusk-700 dark:bg-dusk-950/40 dark:text-dusk-300">
          {state.success}
        </p>
      ) : null}

      <div>
        <SubmitButton>Save profile</SubmitButton>
      </div>
    </form>
  );
}
