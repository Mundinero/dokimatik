import { useLanguage } from '../context/LanguageContext'
import { RUBRIC } from '../constants/rubric'

export function ScorecardShell() {
  const { t } = useLanguage()
  const s = t.scorecard

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '116px',
        paddingBottom: '48px',
        background: '#040506',
      }}
    >
      <div className="scorecard-content">
        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <BadgeSkeleton label={s.badgeType} />
          <BadgeSkeleton label={s.badgeStack} />
          <BadgeSkeleton label={s.badgeHosting} />
        </div>

        {/* Score + Radar */}
        <div className="score-radar-grid">
          <div
            style={{
              background: '#07080a',
              border: '1px solid #1b1c1e',
              borderRadius: '11px',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            <p
              style={{
                fontFamily: '"Satoshi", system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '11px',
                color: '#6a6b6c',
                letterSpacing: '0.07em',
                margin: '0 0 12px',
              }}
            >
              {s.globalScore}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
              <span
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '72px',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '-0.13px',
                  color: '#1e1f20',
                }}
              >
                —.—
              </span>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '16px', color: '#363739' }}>
                / 10
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  background: '#111214',
                  border: '1px solid #363739',
                  borderRadius: '6px',
                  padding: '5px 14px',
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  color: '#3a3b3c',
                }}
              >
                {s.notEvaluated}
              </div>
              <p style={{ fontSize: '12px', color: '#3a3b3c', margin: 0 }}>
                {s.uploadHint}
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#07080a',
              border: '1px solid #1b1c1e',
              borderRadius: '11px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            <RadarChart radarLabels={s.radarLabels} />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3a3b3c', letterSpacing: '0.07em' }}>
              {s.dimensions}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#111214' }} />
            <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '10px', color: '#252627' }}>
              {s.threshold}
            </span>
          </div>

          <div className="dimension-grid">
            {RUBRIC.map((dim, i) => (
              <DimensionRow
                key={dim.id}
                label={s.dimensionLabels[dim.id as keyof typeof s.dimensionLabels]}
                weight={dim.weight}
                nullable={dim.nullable}
                nullableLabel={s.nullable}
                delay={i * 25}
              />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div
          style={{
            background: '#07080a',
            border: '1px solid #1b1c1e',
            borderRadius: '11px',
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3a3b3c', letterSpacing: '0.07em' }}>
              {s.recommendations}
            </span>
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: '9px',
                color: '#252627',
                background: '#0d0e10',
                border: '1px solid #1b1c1e',
                borderRadius: '4px',
                padding: '1px 6px',
              }}
            >
              {s.recsHint}
            </span>
          </div>

          <div className="recs-grid">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  background: '#0d0e10',
                  border: '1px solid #111214',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    background: '#111214',
                    border: '1px solid #1b1c1e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '9px', color: '#252627' }}>
                    {n}
                  </span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div
                    className="skeleton"
                    style={{ height: '10px', borderRadius: '3px', width: `${82 - n * 8}%` }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: '8px', borderRadius: '3px', width: `${60 - n * 5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────

interface RadarChartProps {
  scores?:      Record<string, number | null>
  radarLabels:  Record<string, string>
}

function RadarChart({ scores, radarLabels }: RadarChartProps) {
  const SIZE    = 280
  const CX      = SIZE / 2
  const CY      = SIZE / 2
  const MAX_R   = 88
  const LABEL_R = 110
  const LEVELS  = 5
  const N       = RUBRIC.length

  const angleAt = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / N

  const pt = (i: number, r: number) => ({
    x: CX + r * Math.cos(angleAt(i)),
    y: CY + r * Math.sin(angleAt(i)),
  })

  const polyPath = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + 'Z'

  const gridPath  = (r: number) => polyPath(RUBRIC.map((_, i) => pt(i, r)))

  const hasScores = scores && RUBRIC.some(d => scores[d.id] !== null && scores[d.id] !== undefined)
  const scorePts  = hasScores
    ? RUBRIC.map((dim, i) => {
        const v = scores![dim.id]
        return pt(i, v !== null && v !== undefined ? (v / 10) * MAX_R : 0)
      })
    : null

  const textAnchor = (i: number) => {
    const cos = Math.cos(angleAt(i))
    if (Math.abs(cos) < 0.15) return 'middle'
    return cos > 0 ? 'start' : 'end'
  }

  const dominantBaseline = (i: number) => {
    const sin = Math.sin(angleAt(i))
    if (Math.abs(sin) < 0.15) return 'middle'
    return sin < 0 ? 'auto' : 'hanging'
  }

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible' }}
      role="img"
      aria-label="Radar chart — 9 dimensions"
    >
      {/* Grid rings */}
      {Array.from({ length: LEVELS }, (_, l) => (
        <path
          key={l}
          d={gridPath(((l + 1) / LEVELS) * MAX_R)}
          fill="none"
          stroke="#111214"
          strokeWidth="1"
        />
      ))}

      {/* Level numbers on right axis */}
      {Array.from({ length: LEVELS }, (_, l) => {
        const r = ((l + 1) / LEVELS) * MAX_R
        return (
          <text
            key={l}
            x={CX + r + 3}
            y={CY - 2}
            fontSize="7"
            fill="#252627"
            fontFamily='"Geist Mono", monospace'
          >
            {((l + 1) / LEVELS) * 10}
          </text>
        )
      })}

      {/* Axes */}
      {RUBRIC.map((_, i) => {
        const p = pt(i, MAX_R)
        return (
          <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#111214" strokeWidth="1" />
        )
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={2} fill="#1b1c1e" />

      {/* Score area */}
      {scorePts && (
        <>
          <path d={polyPath(scorePts)} fill="rgba(255,99,99,0.1)" />
          <path d={polyPath(scorePts)} fill="none" stroke="#ff6363" strokeWidth="1.5" strokeOpacity="0.7" />
        </>
      )}

      {/* Score dots */}
      {hasScores && RUBRIC.map((dim, i) => {
        const v = scores![dim.id]
        if (v === null || v === undefined) return null
        const p = pt(i, (v / 10) * MAX_R)
        return <circle key={dim.id} cx={p.x} cy={p.y} r={3} fill="#ff6363" />
      })}

      {/* Outer vertex dots */}
      {RUBRIC.map((_, i) => {
        const p = pt(i, MAX_R)
        return <circle key={i} cx={p.x} cy={p.y} r={2} fill="#1b1c1e" />
      })}

      {/* Labels */}
      {RUBRIC.map((dim, i) => {
        const p = pt(i, LABEL_R)
        return (
          <text
            key={dim.id}
            x={p.x}
            y={p.y}
            textAnchor={textAnchor(i)}
            dominantBaseline={dominantBaseline(i)}
            fontSize="9"
            fill="#4a4b4c"
            fontFamily='"Satoshi", system-ui, sans-serif'
            fontWeight="500"
          >
            {radarLabels[dim.id] ?? dim.id}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Dimension row ────────────────────────────────────────────────────────────

function DimensionRow({
  label, weight, nullable, nullableLabel, delay,
}: {
  label:         string
  weight:        number
  nullable:      boolean
  nullableLabel: string
  delay:         number
}) {
  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '10px 12px',
        background: '#07080a',
        border: '1px solid #111214',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1b1c1e', flexShrink: 0 }} />
        <span
          style={{ fontSize: '12px', fontWeight: 500, color: '#4a4b4c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={label}
        >
          {label}
        </span>
        {nullable && (
          <span
            style={{
              fontSize: '9px',
              color: '#252627',
              background: '#0d0e10',
              border: '1px solid #1b1c1e',
              borderRadius: '3px',
              padding: '1px 4px',
              letterSpacing: '0.03em',
              flexShrink: 0,
            }}
          >
            {nullableLabel}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '9px', color: '#252627' }}>
          ×{weight.toFixed(2)}
        </span>
        <span
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '13px',
            fontWeight: 500,
            color: '#1b1c1e',
            minWidth: '22px',
            textAlign: 'right',
          }}
        >
          —
        </span>
      </div>
    </div>
  )
}

// ─── Badge skeleton ───────────────────────────────────────────────────────────

function BadgeSkeleton({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        background: '#07080a',
        border: '1px solid #1b1c1e',
        borderRadius: '6px',
      }}
    >
      <span style={{ fontSize: '11px', color: '#2e2f30', letterSpacing: '0.04em' }}>{label}</span>
      <div className="skeleton" style={{ width: '44px', height: '10px', borderRadius: '3px' }} />
    </div>
  )
}
