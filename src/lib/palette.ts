/** One colour per option, used consistently across cards, chart, and tree. */
export const OPTION_COLORS = ['#2456F5', '#0E9F8E', '#E59B12', '#7455E8', '#D6459B', '#7D9A1E'] as const

export const MAX_OPTIONS = OPTION_COLORS.length

export function optionColor(index: number): string {
  return OPTION_COLORS[index % OPTION_COLORS.length]
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index)
}

export const DANGER = '#D92D20'
export const GOOD = '#0B8F5B'
