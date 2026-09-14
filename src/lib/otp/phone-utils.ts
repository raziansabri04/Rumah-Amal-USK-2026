/**
 * Utility functions for Indonesian phone number formatting, normalization, and masking.
 */

/**
 * Normalizes an Indonesian phone number into standard international format without '+' prefix (e.g. 6281234567890).
 * Handles formats like '0812-3456-7890', '+62 812 3456 7890', '6281234567890', etc.
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';

  // Strip all non-digit characters except leading plus if any
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');

  // Remove leading '+'
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Convert '08...' to '628...'
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }

  // If starts with '8...', add '62'
  if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

/**
 * Masks a phone number for secure public display.
 * Example: '081234567890' -> '0812 •••• 7890'
 * Example: '6281234567890' -> '+62 812 •••• 7890'
 */
export function maskPhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';

  const clean = rawPhone.trim();
  
  // If shorter than 7 digits, mask middle partially
  if (clean.length <= 6) {
    return clean.slice(0, 2) + '••••' + clean.slice(-2);
  }

  // If starts with 62 or +62
  if (clean.startsWith('+62') || clean.startsWith('62')) {
    const withoutPrefix = clean.startsWith('+62') ? clean.slice(3) : clean.slice(2);
    const prefix = '0' + withoutPrefix.slice(0, 3); // e.g. 0812
    const suffix = withoutPrefix.slice(-4); // e.g. 7890
    return `${prefix} •••• ${suffix}`;
  }

  // If starts with 08...
  if (clean.startsWith('0')) {
    const prefix = clean.slice(0, 4); // e.g. 0812
    const suffix = clean.slice(-4);   // e.g. 7890
    return `${prefix} •••• ${suffix}`;
  }

  // Fallback for general numbers
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-3);
  return `${prefix}••••${suffix}`;
}
