"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState, type ChangeEvent } from "react";
import { ImageUp } from "lucide-react";

import type { ActionState } from "@/lib/action-state";
import { saveLogo } from "@/lib/actions/settings";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";

const MAX_DIMENSION = 512;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const image = new window.Image();

      image.onerror = () => reject(new Error("Could not read the image."));
      image.onload = () => {
        const scale = Math.min(
          1,
          MAX_DIMENSION / Math.max(image.width, image.height),
        );
        const canvas = document.createElement("canvas");

        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Image editing is not available."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.9));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export function LogoUpload({ hasLogo }: { hasLogo: boolean }) {
  const [saveState, saveAction] = useActionState<ActionState, FormData>(
    saveLogo,
    undefined,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (saveState?.success) {
      window.location.reload();
    }
  }, [saveState]);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setLocalError(null);

    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setLocalError("Choose a PNG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 8_000_000) {
      setLocalError("Choose an image smaller than 8 MB.");
      event.target.value = "";
      return;
    }

    setBusy(true);

    try {
      setPreview(await readImage(file));
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Could not read the image.",
      );
    } finally {
      setBusy(false);
    }
  }

  const background = preview
    ? `url("${preview}")`
    : hasLogo
      ? `url("/api/branding/logo")`
      : undefined;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Clinic logo
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload the logo shown in the header and sidebars. PNG or WebP with a
          transparent background works best.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div
          role="img"
          aria-label={
            preview
              ? "New logo preview"
              : hasLogo
                ? "Current clinic logo"
                : "No logo uploaded"
          }
          className="grid size-20 shrink-0 place-items-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 bg-contain bg-center bg-no-repeat text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
          style={{ backgroundImage: background }}
        >
          {preview || hasLogo ? null : "No logo"}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={onFile}
            className="block w-full text-sm text-zinc-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200"
          />
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {busy
              ? "Processing image…"
              : "PNG, JPEG, or WebP · resized to 512 px · up to 8 MB"}
          </p>
        </div>
      </div>

      <FormError message={localError ?? saveState?.error} />

      <div className="flex flex-wrap items-center gap-2">
        <form action={saveAction} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="logo" value={preview ?? ""} />
          <SubmitButton disabled={!preview || busy} pendingLabel="Uploading…">
            <ImageUp className="size-4" />
            Upload logo
          </SubmitButton>

          {hasLogo ? (
            <SubmitButton
              name="intent"
              value="remove"
              variant="outline"
              pendingLabel="Removing…"
            >
              Remove logo
            </SubmitButton>
          ) : null}
        </form>

        {hasLogo ? null : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Browse files
          </button>
        )}
      </div>

      {saveState?.success ? (
        <p className="text-sm font-medium text-dusk-600 dark:text-dusk-400">
          {saveState.success}
        </p>
      ) : null}
    </section>
  );
}
