import { useLanguage } from '../context/LanguageContext'
import { RUBRIC } from '../constants/rubric'
import type { EvaluationResult } from '../constants/rubric'
import { scoreColor } from '../constants/design'

interface ScorecardProps {
  result: EvaluationResult
}

export function Scorecard({ result }: ScorecardProps) {
  const { t } = useLanguage()
  const s = t.scorecard
  const color = scoreColor(result.overallScore)

  const scoreLabelText =
    result.overallScore >= 7   ? s.scoreReady :
    result.overallScore >= 5   ? s.scoreWork  :
                                  s.scoreNotReady

  const scoreMap: Record<string, number | null> = {}
  for (const d of result.dimensions) scoreMap[d.dimension.id] = d.score

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
          <Badge label={s.badgeType}    value={result.projectType} />
          <Badge label={s.badgeStack}   value={result.detectedStack} />
          <Badge label={s.badgeHosting} value={result.hostingPlatform || '—'} />
          {result.hasAgentMemory && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: 'rgba(89,212,153,0.08)',
                border: '1px solid rgba(89,212,153,0.2)',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontSize: '11px', color: '#59d499', letterSpacing: '0.04em' }}>
                {s.agentMemoryBadge}
              </span>
            </div>
          )}
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
                className="animate-fade-in"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: '72px',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '-0.13px',
                  color,
                }}
              >
                {result.overallScore.toFixed(1)}
              </span>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '16px', color: '#363739' }}>
                / 10
              </span>
            </div>

            <div
              className="animate-fade-in"
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                background: `${color}14`,
                border: `1px solid ${color}33`,
                borderRadius: '6px',
                padding: '5px 14px',
                fontFamily: '"Geist Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.06em',
                color,
              }}
            >
              {scoreLabelText}
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
            <RadarChart scores={scoreMap} radarLabels={s.radarLabels} />
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
            {result.dimensions.map((d, i) => (
              <DimensionRow
                key={d.dimension.id}
                label={s.dimensionLabels[d.dimension.id as keyof typeof s.dimensionLabels]}
                weight={d.dimension.weight}
                score={d.score}
                justification={d.justification}
                nullableLabel={s.nullable}
                delay={i * 30}
              />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
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
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
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
                      marginTop: '1px',
                    }}
                  >
                    <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: '9px', color: '#3a3b3c' }}>
                      {rec.priority}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: '12px',
                        color: '#9c9c9d',
                        margin: '0 0 4px',
                        lineHeight: 1.3,
                      }}
                    >
                      {rec.title}
                    </p>
                    <p style={{ fontSize: '11px', color: '#4a4b4c', margin: 0, lineHeight: 1.5 }}>
                      {rec.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────

function RadarChart({
  scores,
  radarLabels,
}: {
  scores:      Record<string, number | null>
  radarLabels: Record<string, string>
}) {
  const SIZE    = 280
  const CX      = SIZE / 2
  const CY      = SIZE / 2
  const MAX_R   = 88
  const LABEL_R = 110
  const LEVELS  = 5
  const N       = RUBRIC.length

  const angle   = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / N
  const pt      = (i: number, r: number) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  })
  const poly    = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + 'Z'
  const ring    = (r: number) => poly(RUBRIC.map((_, i) => pt(i, r)))

  const scorePts = RUBRIC.map((dim, i) => {
    const v = scores[dim.id]
    return pt(i, v !== null && v !== undefined ? (v / 10) * MAX_R : 0)
  })

  const anchor = (i: number) => {
    const c = Math.cos(angle(i))
    return Math.abs(c) < 0.15 ? 'middle' : c > 0 ? 'start' : 'end'
  }
  const baseline = (i: number) => {
    const s = Math.sin(angle(i))
    return Math.abs(s) < 0.15 ? 'middle' : s < 0 ? 'auto' : 'hanging'
  }

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ overflow: 'visible' }}
      aria-label="Radar chart — 9 dimensions"
    >
      {Array.from({ length: LEVELS }, (_, l) => (
        <path key={l} d={ring(((l + 1) / LEVELS) * MAX_R)} fill="none" stroke="#111214" strokeWidth="1" />
      ))}
      {Array.from({ length: LEVELS }, (_, l) => {
        const r = ((l + 1) / LEVELS) * MAX_R
        return (
          <text key={l} x={CX + r + 3} y={CY - 2} fontSize="7" fill="#252627" fontFamily='"Geist Mono", monospace'>
            {((l + 1) / LEVELS) * 10}
          </text>
        )
      })}
      {RUBRIC.map((_, i) => {
        const p = pt(i, MAX_R)
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#111214" strokeWidth="1" />
      })}
      <circle cx={CX} cy={CY} r={2} fill="#1b1c1e" />

      <path d={poly(scorePts)} fill="rgba(240,61,48,0.1)" />
      <path d={poly(scorePts)} fill="none" stroke="#f03d30" strokeWidth="1.5" strokeOpacity="0.7" />

      {RUBRIC.map((dim, i) => {
        const v = scores[dim.id]
        if (v === null || v === undefined) return null
        const p = pt(i, (v / 10) * MAX_R)
        return <circle key={dim.id} cx={p.x} cy={p.y} r={3} fill="#f03d30" />
      })}
      {RUBRIC.map((_, i) => {
        const p = pt(i, MAX_R)
        return <circle key={i} cx={p.x} cy={p.y} r={2} fill="#1b1c1e" />
      })}
      {RUBRIC.map((dim, i) => {
        const p = pt(i, LABEL_R)
        return (
          <text
            key={dim.id}
            x={p.x}
            y={p.y}
            textAnchor={anchor(i)}
            dominantBaseline={baseline(i)}
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
  label, weight, score, justification, nullableLabel, delay,
}: {
  label:         string
  weight:        number
  score:         number | null
  justification: string
  nullableLabel: string
  delay:         number
}) {
  const isNA    = score === null
  const color   = isNA ? '#252627' : scoreColor(score)

  return (
    <div
      className="animate-fade-in"
      title={justification}
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
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: isNA ? '#1b1c1e' : color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: isNA ? '#3a3b3c' : '#9c9c9d',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={label}
        >
          {label}
        </span>
        {isNA && (
          <span
            style={{
              fontSize: '9px',
              color: '#252627',
              background: '#0d0e10',
              border: '1px solid #1b1c1e',
              borderRadius: '3px',
              padding: '1px 4px',
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
            color: isNA ? '#252627' : color,
            minWidth: '22px',
            textAlign: 'right',
          }}
        >
          {isNA ? '—' : score!.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="animate-fade-in"
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
      <span style={{ fontSize: '11px', color: '#3a3b3c', letterSpacing: '0.04em' }}>{label}</span>
      <span
        style={{
          fontFamily: '"Geist Mono", monospace',
          fontSize: '11px',
          color: '#6a6b6c',
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  )
}
