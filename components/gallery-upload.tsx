"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useActionState } from "react";
import { ImageUp } from "lucide-react";

import type { ActionState } from "@/lib/action-state";
import { saveGalleryPhoto } from "@/lib/actions/settings";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";

const MAX_DIMENSION = 1280;
const MAX_FILE_SIZE = 12_000_000;
const MAX_DATA_LENGTH = 2_500_000;
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
        resolve(canvas.toDataURL("image/webp", 0.82));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export type GallerySlot = { slot: number; hasImage: boolean };

export function GalleryUpload({ slots }: { slots: GallerySlot[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Clinic photos
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload up to six photos for the public gallery on the landing page.
          Images are resized automatically.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <GallerySlotCard key={slot.slot} {...slot} />
        ))}
      </div>
    </section>
  );
}

function GallerySlotCard({ slot, hasImage }: GallerySlot) {
  const [state, action] = useActionState<ActionState, FormData>(
    saveGalleryPhoto,
    undefined,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setLocalError(null);

    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setLocalError("Choose a PNG, JPEG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLocalError("Choose an image smaller than 12 MB.");
      event.target.value = "";
      return;
    }

    setBusy(true);

    try {
      const result = await readImage(file);

      if (result.length > MAX_DATA_LENGTH) {
        setLocalError("Image is too large. Choose a smaller file.");
        event.target.value = "";
        return;
      }

      setPreview(result);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Could not read the image.",
      );
    } finally {
      setBusy(false);
    }
  }

  const imageUrl = preview ?? (hasImage ? `/api/branding/gallery/${slot}` : null);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div
        role="img"
        aria-label={imageUrl ? `Photo ${slot}` : `Photo ${slot} slot is empty`}
        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-white bg-cover bg-center bg-no-repeat dark:border-zinc-700 dark:bg-zinc-900"
        style={{
          backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        }}
      >
        {imageUrl ? null : (
          <div className="grid h-full place-items-center gap-1 text-zinc-400 dark:text-zinc-500">
            <ImageUp className="size-6" />
            <span className="text-xs font-medium">Photo {slot}</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {slot}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        onChange={onFile}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ImageUp className="size-4" />
          Choose
        </button>

        <form action={action}>
          <input type="hidden" name="slot" value={slot} />
          <input type="hidden" name="photo" value={preview ?? ""} />
          <SubmitButton
            size="sm"
            disabled={!preview || busy}
            pendingLabel="Uploading…"
          >
            Upload
          </SubmitButton>
        </form>

        {hasImage ? (
          <form action={action}>
            <input type="hidden" name="slot" value={slot} />
            <input type="hidden" name="intent" value="remove" />
            <SubmitButton
              size="sm"
              variant="ghost"
              pendingLabel="Removing…"
            >
              Remove
            </SubmitButton>
          </form>
        ) : null}
      </div>

      {busy ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Processing image…
        </p>
      ) : null}

      <FormError message={localError ?? state?.error} />

      {state?.success ? (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {state.success}
        </p>
      ) : null}
    </div>
  );
}
