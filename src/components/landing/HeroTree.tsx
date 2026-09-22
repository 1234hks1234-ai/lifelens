import { useState, type CSSProperties } from 'react'

const ROOT = { x: 74, y: 260 }
const OPTION_X = 252
const LEAF_X = 432

interface Leaf {
  dy: number
  r: number
  text: string
}

interface Branch {
  y: number
  color: string
  label: string
  leaves: Leaf[]
}

const BRANCHES: Branch[] = [
  {
    y: 112,
    color: '#2456F5',
    label: 'Accept the offer',
    leaves: [
      { dy: -40, r: 12, text: 'Higher pay' },
      { dy: 40, r: 8, text: 'Steeper learning curve' },
    ],
  },
  {
    y: 260,
    color: '#0E9F8E',
    label: 'Stay where I am',
    leaves: [
      { dy: -40, r: 10, text: 'Steady income' },
      { dy: 40, r: 7, text: 'Slower growth' },
    ],
  },
  {
    y: 408,
    color: '#E59B12',
    label: 'Go freelance',
    leaves: [
      { dy: -40, r: 13, text: 'Flexible time' },
      { dy: 40, r: 8, text: 'Uneven income' },
    ],
  },
]

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2
  return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as CSSProperties

/**
 * Abstract decision tree for the hero. The branches draw in once on load;
 * hovering a branch dims the others so its path is easy to follow.
 */
export function HeroTree() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <svg
      viewBox="0 0 620 520"
      className="block h-auto w-full"
      role="img"
      aria-label="An abstract decision tree. One decision branches into three options, and each option branches into two possible outcomes."
    >
      {/* Rings around the root: the lens */}
      {[80, 160, 250, 350].map((r, i) => (
        <circle
          key={r}
          cx={ROOT.x}
          cy={ROOT.y}
          r={r}
          fill="none"
          stroke="#0E1726"
          strokeOpacity={0.09 - i * 0.017}
          strokeWidth={1}
        />
      ))}

      {BRANCHES.map((branch, i) => {
        const dim = active !== null && active !== i
        const base = 0.2 + i * 0.12
        return (
          <g
            key={branch.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{ opacity: dim ? 0.22 : 1, transition: 'opacity 250ms ease' }}
          >
            <rect x={ROOT.x + 20} y={branch.y - 72} width={620 - ROOT.x - 20} height={144} fill="transparent" />

            <path
              d={curve(ROOT.x + 30, ROOT.y, OPTION_X - 15, branch.y)}
              pathLength={1}
              fill="none"
              stroke={branch.color}
              strokeWidth={3.5}
              strokeLinecap="round"
              className="tree-draw"
              style={delay(base)}
            />

            {branch.leaves.map((leaf, k) => {
              const ly = branch.y + leaf.dy
              return (
                <g key={leaf.text}>
                  <path
                    d={curve(OPTION_X + 15, branch.y, LEAF_X - leaf.r, ly)}
                    pathLength={1}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeOpacity={0.75}
                    className="tree-draw"
                    style={delay(base + 0.75 + k * 0.1)}
                  />
                  <g className="tree-pop" style={delay(base + 1.5 + k * 0.1)}>
                    <circle cx={LEAF_X} cy={ly} r={leaf.r} fill={branch.color} fillOpacity={0.16} stroke={branch.color} strokeWidth={2} />
                    <text x={LEAF_X + leaf.r + 10} y={ly + 4} fontSize={12.5} fill="#2E3A4E">
                      {leaf.text}
                    </text>
                  </g>
                </g>
              )
            })}

            <g className="tree-pop" style={delay(base + 0.7)}>
              <circle cx={OPTION_X} cy={branch.y} r={15} fill="#fff" stroke={branch.color} strokeWidth={3} />
              <circle cx={OPTION_X} cy={branch.y} r={5} fill={branch.color} />
              <text
                x={OPTION_X}
                y={branch.y - 28}
                textAnchor="middle"
                fontSize={13.5}
                fontWeight={600}
                fill="#0E1726"
                className="font-display"
              >
                {branch.label}
              </text>
            </g>
          </g>
        )
      })}

      <g className="tree-pop" style={delay(0)}>
        <circle cx={ROOT.x} cy={ROOT.y} r={30} fill="#0E1726" />
        <circle cx={ROOT.x} cy={ROOT.y} r={11} fill="none" stroke="#fff" strokeWidth={2} />
        <circle cx={ROOT.x} cy={ROOT.y} r={3.5} fill="#fff" />
        <text x={ROOT.x} y={ROOT.y + 54} textAnchor="middle" fontSize={12.5} fill="#5A6678">
          Your decision
        </text>
      </g>
    </svg>
  )
}
