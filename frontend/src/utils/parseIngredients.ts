/**
 * Parses a URL search param value into a clean string array of ingredients.
 *
 * Handles two formats:
 * - JSON array: `encodeURIComponent(JSON.stringify(["cà rốt", "hành"]))`
 * - CSV string: `"cà rốt,hành"`
 */
export function parseIngredientsFromURL(raw: string | null): string[] {
  if (!raw) return [];

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  // Try JSON array first
  try {
    const parsed = JSON.parse(decoded) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (x): x is string => typeof x === 'string' && x.trim().length > 0,
      );
    }
  } catch {
    // Fall through to CSV split
  }

  return decoded
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
