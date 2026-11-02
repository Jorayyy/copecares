export type ActionState = { error?: string; success?: string } | undefined;

export function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function optionalValue(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value.length > 0 ? value : null;
}

export function formNumber(formData: FormData, key: string) {
  return Number(formValue(formData, key) || "0");
}

export function formInt(formData: FormData, key: string) {
  return Number.parseInt(formValue(formData, key) || "0", 10);
}

export function formBoolean(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value === "on" || value === "true" || value === "1";
}

export function formDate(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

export function formDateTime(formData: FormData, key: string) {
  const value = formValue(formData, key);
  return value ? new Date(value) : null;
}

export function formIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
