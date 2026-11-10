"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 700;
const JPEG_QUALITY = 0.75;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image."));
    image.src = src;
  });
}

async function compressImage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(image.width, image.height),
    );
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) throw new Error("Could not process that image.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function ImageUpload({
  name,
  label = "Photo",
  initialImage,
  shape = "square",
}: {
  name: string;
  label?: string;
  initialImage?: string | null;
  shape?: "square" | "circle";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(initialImage ?? "");
  const [value, setValue] = useState("");
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setBusy(true);

    try {
      const dataUrl = await compressImage(file);
      setPreview(dataUrl);
      setValue(dataUrl);
      setRemoved(false);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not process that image.",
      );
    } finally {
      setBusy(false);
    }
  }

  function clearImage() {
    setPreview("");
    setValue("");
    setRemoved(true);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {label}
      </span>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative grid size-20 shrink-0 place-items-center overflow-hidden border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800",
            shape === "circle" ? "rounded-full" : "rounded-lg",
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt=""
              width={160}
              height={160}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-6 text-zinc-400" />
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            className={buttonVariants({ variant: "outline", size: "sm" })}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy ? "Processing" : preview ? "Change" : "Upload"}
          </button>
          {preview ? (
            <button
              type="button"
              onClick={clearImage}
              className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Remove
            </button>
          ) : null}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            JPG or PNG, up to 10 MB.
          </p>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <input type="hidden" name={name} value={value} />
      <input type="hidden" name={`${name}Removed`} value={removed ? "1" : ""} />
    </div>
  );
}
