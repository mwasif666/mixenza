/** Standard checkout shipping estimate. Keep backend shipping rules in sync. */
export const FREE_SHIPPING_THRESHOLD = 5000
export const STANDARD_SHIPPING_FEE = 250
export const calculateShipping = (subtotal: number): number =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
