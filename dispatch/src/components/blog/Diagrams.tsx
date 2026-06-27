import type { DiagramName } from "@/lib/blog/types"

// Reusable, on-brand inline SVG diagrams. Authors reference one by name via a
// { type: "diagram", name } block. Colors come from the Dispatch palette.

const NAVY = "#141414"
const YELLOW = "#FDFF60"
const TEAL = "#9DDAD7"
const PEACH = "#F5B48C"
const GRAY = "#EDECEC"
const GRAYTEXT = "#666666"

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 720 300"
      className="h-auto w-full"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      {children}
    </svg>
  )
}

function AiMaturity() {
  const stages = ["Individual", "Team", "Shared", "Governed", "Operating System"]
  const colors = [GRAY, TEAL, TEAL, PEACH, YELLOW]
  return (
    <Frame>
      {stages.map((s, i) => {
        const w = 128
        const x = 20 + i * 138
        const h = 36 + i * 44
        const y = 250 - h
        return (
          <g key={s}>
            <rect x={x} y={y} width={w} height={h} rx="10" fill={colors[i]} />
            <text
              x={x + w / 2}
              y={y - 10}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={NAVY}
            >
              {s}
            </text>
            <text
              x={x + w / 2}
              y={268}
              textAnchor="middle"
              fontSize="12"
              fill={GRAYTEXT}
            >
              Stage {i + 1}
            </text>
          </g>
        )
      })}
    </Frame>
  )
}

function HorizontalPipeline({ steps }: { steps: string[] }) {
  const n = steps.length
  const boxW = 96
  const gap = (720 - 40 - boxW * n) / (n - 1)
  return (
    <Frame>
      {steps.map((s, i) => {
        const x = 20 + i * (boxW + gap)
        const y = 120
        return (
          <g key={s}>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={60}
              rx="12"
              fill={i % 2 === 0 ? NAVY : TEAL}
            />
            <text
              x={x + boxW / 2}
              y={y + 35}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={i % 2 === 0 ? "#ffffff" : NAVY}
            >
              {s}
            </text>
            {i < n - 1 && (
              <path
                d={`M ${x + boxW + 6} ${y + 30} L ${x + boxW + gap - 6} ${y + 30}`}
                stroke={GRAYTEXT}
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        )
      })}
      <defs>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={GRAYTEXT} />
        </marker>
      </defs>
    </Frame>
  )
}

function PromptLifecycle() {
  const nodes = ["Create", "Test", "Share", "Version", "Govern", "Reuse"]
  const cx = 360
  const cy = 150
  const r = 110
  return (
    <Frame>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GRAY} strokeWidth="2" />
      {nodes.map((label, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        return (
          <g key={label}>
            <circle cx={x} cy={y} r="34" fill={i % 2 === 0 ? YELLOW : TEAL} />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={NAVY}
            >
              {label}
            </text>
          </g>
        )
      })}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={GRAYTEXT}
      >
        Prompt
      </text>
    </Frame>
  )
}

function KnowledgeFlow() {
  const layers = [
    { label: "People", sub: "Sales, Marketing, Ops", color: GRAY },
    { label: "AI Assets", sub: "Prompts, Workflows", color: TEAL },
    { label: "Shared System", sub: "One source of truth", color: PEACH },
    { label: "Organization", sub: "Compounding knowledge", color: YELLOW },
  ]
  return (
    <Frame>
      {layers.map((l, i) => {
        const x = 16 + i * 178
        const y = 110
        return (
          <g key={l.label}>
            <rect x={x} y={y} width={150} height={84} rx="12" fill={l.color} />
            <text
              x={x + 75}
              y={y + 38}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={NAVY}
            >
              {l.label}
            </text>
            <text
              x={x + 75}
              y={y + 58}
              textAnchor="middle"
              fontSize="10.5"
              fill={NAVY}
              opacity="0.7"
            >
              {l.sub}
            </text>
            {i < layers.length - 1 && (
              <path
                d={`M ${x + 156} ${y + 42} L ${x + 172} ${y + 42}`}
                stroke={GRAYTEXT}
                strokeWidth="2"
                markerEnd="url(#arrow2)"
              />
            )}
          </g>
        )
      })}
      <defs>
        <marker
          id="arrow2"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={GRAYTEXT} />
        </marker>
      </defs>
    </Frame>
  )
}

function GovernanceModel() {
  const layers = [
    { label: "Audit", w: 560, color: GRAY },
    { label: "Policy", w: 430, color: TEAL },
    { label: "Approval", w: 300, color: PEACH },
    { label: "Access", w: 170, color: YELLOW },
  ]
  return (
    <Frame>
      {layers.map((l, i) => {
        const x = 360 - l.w / 2
        const y = 40 + i * 56
        return (
          <g key={l.label}>
            <rect x={x} y={y} width={l.w} height={46} rx="10" fill={l.color} />
            <text
              x={360}
              y={y + 29}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={NAVY}
            >
              {l.label}
            </text>
          </g>
        )
      })}
    </Frame>
  )
}

export function Diagram({
  name,
  caption,
}: {
  name: DiagramName
  caption?: string
}) {
  const map: Record<DiagramName, React.ReactNode> = {
    "ai-maturity": <AiMaturity />,
    "prompt-lifecycle": <PromptLifecycle />,
    "knowledge-flow": <KnowledgeFlow />,
    "governance-model": <GovernanceModel />,
    "asset-lifecycle": (
      <HorizontalPipeline
        steps={["Draft", "Review", "Publish", "Use", "Update", "Retire"]}
      />
    ),
  }

  return (
    <figure className="my-10">
      <div className="rounded-2xl border border-[#E5E5E3] bg-[#F7F7F6] p-6 sm:p-8">
        {map[name]}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[13px] text-[#999]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
