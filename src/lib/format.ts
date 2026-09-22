const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  return usd.format(Math.round(value))
}

/** Short form for chart axes and tight spaces: $800, $12k, $1.5M. */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `$${trimZero(value / 1_000_000)}M`
  if (abs >= 1_000) return `$${trimZero(value / 1_000)}k`
  return `$${Math.round(value)}`
}

function trimZero(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

/** Compact duration: 6 mo, 7.2 mo, 2.5 yrs. */
export function formatMonths(months: number): string {
  const rounded = Math.round(months * 10) / 10
  if (rounded >= 24) return `${Math.round((rounded / 12) * 10) / 10} yrs`
  return `${rounded} mo`
}

/** Slider readout: 1 month, 6 months. */
export function formatMonthsLong(months: number): string {
  return `${months} ${months === 1 ? 'month' : 'months'}`
}

export function formatSignedPercent(value: number): string {
  if (value === 0) return '0%'
  return `${value > 0 ? '+' : '\u2212'}${Math.abs(value)}%`
}

export function importanceLabel(value: number): string {
  if (value <= 2) return 'Minor'
  if (value <= 4) return 'Low'
  if (value <= 6) return 'Moderate'
  if (value <= 8) return 'High'
  return 'Critical'
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}\u2026` : text
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}
