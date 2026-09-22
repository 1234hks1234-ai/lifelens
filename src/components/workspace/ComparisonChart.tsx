import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Segmented } from '@/components/ui/Segmented'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { formatCompactCurrency, formatCurrency, formatMonths, truncate } from '@/lib/format'
import type { ScoredOption } from '@/types'

type MetricKey = 'overall' | 'cost' | 'time' | 'importance'

interface MetricConfig {
  label: string
  hint: string
  lowerIsBetter: boolean
  value: (s: ScoredOption) => number
  format: (v: number) => string
  axis: (v: number) => string
}

const METRICS: Record<MetricKey, MetricConfig> = {
  overall: {
    label: 'Fit score',
    hint: 'Higher is better. Combines importance, cost, and time using your weights.',
    lowerIsBetter: false,
    value: (s) => s.overall,
    format: (v) => `${Math.round(v)}`,
    axis: (v) => `${Math.round(v)}`,
  },
  cost: {
    label: 'Cost',
    hint: 'Lower is better. Includes any cost change from your assumptions.',
    lowerIsBetter: true,
    value: (s) => s.adjustedCost,
    format: formatCurrency,
    axis: formatCompactCurrency,
  },
  time: {
    label: 'Time',
    hint: 'Lower is better. Includes any timeline change from your assumptions.',
    lowerIsBetter: true,
    value: (s) => s.adjustedMonths,
    format: formatMonths,
    axis: (v) => `${Math.round(v)}`,
  },
  importance: {
    label: 'Importance',
    hint: 'Higher is better. The importance you gave each option.',
    lowerIsBetter: false,
    value: (s) => s.option.importance,
    format: (v) => `${v}/10`,
    axis: (v) => `${v}`,
  },
}

const OPTIONS = (Object.keys(METRICS) as MetricKey[]).map((key) => ({ value: key, label: METRICS[key].label }))

interface ChartRow {
  id: string
  name: string
  value: number
  color: string
}

function ChartTooltip({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartRow }>
  label: string
  formatValue: (v: number) => string
}) {
  if (!active || !payload || payload.length === 0) return null
  const row = payload[0].payload
  return (
    <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm shadow-lift">
      <p className="flex items-center gap-2 font-semibold">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
        {row.name}
      </p>
      <p className="mt-1 text-muted">
        {label}: <span className="font-semibold tabular-nums text-ink">{formatValue(row.value)}</span>
      </p>
    </div>
  )
}

interface ComparisonChartProps {
  scored: ScoredOption[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ComparisonChart({ scored, selectedId, onSelect }: ComparisonChartProps) {
  const [metric, setMetric] = useState<MetricKey>('overall')
  const narrow = useMediaQuery('(max-width: 639px)')
  const config = METRICS[metric]

  const rows: ChartRow[] = scored
    .map((s) => ({ id: s.option.id, name: s.option.name, value: config.value(s), color: s.color }))
    .sort((a, b) => (config.lowerIsBetter ? a.value - b.value : b.value - a.value))

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{config.label} by option</h3>
          <p className="mt-1 max-w-md text-sm text-muted">{config.hint}</p>
        </div>
        <Segmented label="Metric to compare" value={metric} options={OPTIONS} onChange={setMetric} />
      </div>

      <div className="mt-6" role="img" aria-label={`Bar chart of ${config.label.toLowerCase()} for each option`}>
        <ResponsiveContainer width="100%" height={Math.max(200, rows.length * 58 + 32)}>
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 64, bottom: 4, left: 0 }} barCategoryGap={16}>
            <CartesianGrid horizontal={false} stroke="#E2E6EC" strokeDasharray="3 4" />
            <XAxis
              type="number"
              domain={[0, 'dataMax']}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#8A94A6', fontSize: 12 }}
              tickFormatter={(v: unknown) => config.axis(Number(v))}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={narrow ? 96 : 156}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#2E3A4E', fontSize: 13 }}
              tickFormatter={(v: unknown) => truncate(String(v), narrow ? 14 : 24)}
            />
            <Tooltip cursor={{ fill: 'rgba(14,23,38,0.04)' }} content={<ChartTooltip label={config.label} formatValue={config.format} />} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={26} animationDuration={500}>
              {rows.map((row) => (
                <Cell key={row.id} fill={row.color} fillOpacity={selectedId && selectedId !== row.id ? 0.28 : 1} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v: unknown) => config.format(Number(v))}
                style={{ fontSize: 12, fontWeight: 600, fill: '#0E1726' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4" role="group" aria-label="Highlight an option">
        {scored.map((s) => {
          const active = selectedId === s.option.id
          return (
            <button
              key={s.option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(s.option.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active ? 'border-ink bg-ink text-white' : 'border-line text-ink-soft hover:border-ink/30'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {truncate(s.option.name, 28)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
