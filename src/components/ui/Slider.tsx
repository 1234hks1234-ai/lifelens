import type { CSSProperties, ReactNode } from 'react'

interface SliderFieldProps {
  id: string
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Text shown for the current value (also read by screen readers). */
  format: (value: number) => string
  color?: string
  minLabel?: string
  maxLabel?: string
  /** Replaces the default value readout, e.g. with an editable input. */
  valueSlot?: ReactNode
}

export function SliderField({
  id,
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  color = '#2456F5',
  minLabel,
  maxLabel,
  valueSlot,
}: SliderFieldProps) {
  const pct = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const style = { '--fill': `${pct}%`, '--accent': color } as CSSProperties

  return (
    <div>
      <div className="flex min-h-[2.25rem] items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {valueSlot ?? (
          <output htmlFor={id} className="text-sm font-semibold tabular-nums text-ink">
            {format(value)}
          </output>
        )}
      </div>
      {hint && <p className="text-[13px] leading-snug text-muted">{hint}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
        className="lens-range mt-2"
        style={style}
      />
      {(minLabel || maxLabel) && (
        <div className="mt-1 flex justify-between text-xs text-faint">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  )
}
