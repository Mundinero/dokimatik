// Design system tokens — Raycast-inspired dark theme
// Source of truth for all colors, typography, and spacing

export const colors = {
  // Canvas & surfaces
  canvas:    '#040506',
  surfaceL1: '#07080a',
  surfaceL2: '#111214',
  surfaceL3: '#1b1c1e',

  // Borders
  border: '#363739',

  // Text
  textPrimary:   '#ffffff',
  textSecondary: '#9c9c9d',
  textTertiary:  '#6a6b6c',

  // Accent — status and logo only, never as button fill
  accent: '#ff6363',

  // CTA
  ctaBg:   '#e6e6e6',
  ctaText: '#2f3031',

  // Signals
  mint: '#59d499',  // pass / production ready
  sky:  '#56c2ff',  // info / needs work

  // Score thresholds
  scoreHigh:   '#59d499',  // ≥ 7.0
  scoreMid:    '#56c2ff',  // 5.0–6.9
  scoreLow:    '#ff6363',  // < 5.0
} as const

export const fonts = {
  sans: '"Satoshi", system-ui, sans-serif',
  mono: '"Geist Mono", "Fira Code", monospace',
} as const

export const fontWeights = {
  regular: '400',
  medium:  '500',
  semibold: '600',
} as const

export const tracking = {
  headline24: '-0.05px',
  headline32: '-0.06px',
  headline64: '-0.13px',
  badge:      '0.04em',
} as const

export const radius = {
  card:   '11px',
  badge:  '6px',
  input:  '8px',
  modal:  '16px',
  button: '8px',
} as const

export const gradients = {
  // Radial section atmosphere
  sectionAtmosphere: `radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.7), rgba(6,18,37,0.25))`,
} as const

export const shadows = {
  // Monochromatic only
  card:    '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
  cardHover: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
  modal:   '0 24px 64px rgba(0,0,0,0.7)',
  glow: (hex: string) => `0 0 20px ${hex}26, 0 0 40px ${hex}13`,
} as const

export const scoreThreshold = {
  production: 7.0,
  needsWork:  5.0,
} as const

export function scoreColor(score: number): string {
  if (score >= scoreThreshold.production) return colors.mint
  if (score >= scoreThreshold.needsWork)  return colors.sky
  return colors.accent
}

export function scoreLabel(score: number): string {
  if (score >= scoreThreshold.production) return 'PRODUCTION READY'
  if (score >= scoreThreshold.needsWork)  return 'NEEDS WORK'
  return 'NOT READY'
}
