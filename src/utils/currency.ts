const pkr = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Catalog amounts are already PKR; format them without converting their value. */
export function formatMoney(value: number | string | null | undefined) {
    return `Rs. ${pkr.format(Number.isFinite(Number(value)) ? Number(value) : 0)}`
}
