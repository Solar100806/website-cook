/**
 * Match backend `normalizeVietnamese` for client-side ingredient name comparison.
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return "";

  const accentsMap: { base: string; letters: RegExp }[] = [
    { base: "a", letters: /[àáạảãâầấậẩẫăằắặẳẵ]/g },
    { base: "e", letters: /[èéẹẻẽêềếệểễ]/g },
    { base: "i", letters: /[ìíịỉĩ]/g },
    { base: "o", letters: /[òóọỏõôồốộổỗơờớợởỡ]/g },
    { base: "u", letters: /[ùúụủũưừứựửữ]/g },
    { base: "y", letters: /[ỳýỵỷỹ]/g },
    { base: "d", letters: /[đ]/g },
  ];

  let result = str.toLowerCase();
  for (const { base, letters } of accentsMap) {
    result = result.replace(letters, base);
  }
  return result.trim();
}

export function ingredientNameMatchesSelection(
  recipeIngredientName: string,
  selectedNames: string[],
): boolean {
  const n = normalizeVietnamese(recipeIngredientName);
  return selectedNames.some((s) => {
    const ns = normalizeVietnamese(s);
    if (!ns || !n) return false;
    return n === ns || n.includes(ns) || ns.includes(n);
  });
}
