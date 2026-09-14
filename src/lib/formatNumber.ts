/**
 * Formats a raw number string or number into a thousand-separated string (Indonesian locale dots).
 * Example: "1000000" -> "1.000.000"
 */
export function formatThousand(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const rawDigits = String(value).replace(/\D/g, "");
  if (!rawDigits) return "";
  return new Intl.NumberFormat("id-ID").format(BigInt(rawDigits));
}

/**
 * Strips all non-digit characters from a formatted string to get clean numeric string.
 * Example: "1.000.000" -> "1000000"
 */
export function parseRawNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\D/g, "");
}
