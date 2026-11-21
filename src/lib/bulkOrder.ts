/** Wholesale supplier imports with carton MOQ need confirmed bulk pricing. */
export function getBulkMinimum(name: string): number | null {
  const text = String(name || '')
  if (!/minimum\s+order\s+quantity/i.test(text)) return null
  const number = text.match(/\b(?:carton\s*\/\s*|carton\s*\(?\s*|)(\d{1,5})\s*(?:pcs?|pieces|units?)\b/i)
  return number ? Math.max(1, Number(number[1])) : 1
}
export const isBulkOnlyProduct = (name: string) => getBulkMinimum(name) !== null
