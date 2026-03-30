/**
 * Input sanitization utilities — prevents XSS and injection attacks.
 * Lightweight, no dependencies.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape HTML entities to prevent XSS */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] || ch);
}

/** Sanitize user text input: trim, limit length, strip control chars */
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    // Remove zero-width and control characters (except newlines/tabs)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u200B-\u200F\u2028-\u202F\uFEFF]/g, '');
}

/** Sanitize display name: alphanumeric + spaces + common chars, max 50 */
export function sanitizeDisplayName(name: string): string {
  return sanitizeText(name, 50)
    .replace(/[^\p{L}\p{N}\s\-_.]/gu, '') // Only letters, numbers, spaces, hyphens, dots, underscores
    .replace(/\s+/g, ' ');
}

/** Sanitize email: lowercase, trim, validate format */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 255);
}

/** Simple rate limiter for client-side actions */
const rateLimitMap = new Map<string, number[]>();

export function isRateLimited(key: string, maxActions = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxActions) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(key, recent);
  return false;
}
