const IMAGE_DATA_URL =
  /^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

export const MAX_IMAGE_DATA_URL_LENGTH = 2_000_000;

export type ImageFieldResult = {
  value: string | null | undefined;
  error?: string;
};

export function resolveImageField(
  formData: FormData,
  field = "image",
): ImageFieldResult {
  if (formData.get(`${field}Removed`) === "1") {
    return { value: null };
  }

  const raw = formData.get(field);

  if (typeof raw !== "string" || raw.trim() === "") {
    return { value: undefined };
  }

  const value = raw.trim();

  if (
    value.length > MAX_IMAGE_DATA_URL_LENGTH ||
    !IMAGE_DATA_URL.test(value)
  ) {
    return {
      value: undefined,
      error: "Upload a valid JPG, PNG, GIF, or WebP image.",
    };
  }

  return { value };
}
