// Rubric — 9 dimensions, source of truth
// Nullable dimensions redistribute weight proportionally when marked N/A

export interface Dimension {
  id:       string
  label:    string
  weight:   number
  nullable: boolean
}

export const RUBRIC: readonly Dimension[] = [
  { id: 'structure',      label: 'Estructura del proyecto', weight: 0.15, nullable: false },
  { id: 'dependencies',   label: 'Gestión de dependencias', weight: 0.12, nullable: true  },
  { id: 'env_vars',       label: 'Variables de entorno',    weight: 0.12, nullable: true  },
  { id: 'database',       label: 'BD & Persistencia',       weight: 0.10, nullable: true  },
  { id: 'versioning',     label: 'Control de versiones',    weight: 0.10, nullable: false },
  { id: 'hosting',        label: 'Hosting / Deployment',    weight: 0.10, nullable: false },
  { id: 'security',       label: 'Seguridad básica',        weight: 0.13, nullable: false },
  { id: 'agent_memory',   label: 'Persistencia del agente', weight: 0.10, nullable: true  },
  { id: 'error_handling', label: 'Manejo de errores',       weight: 0.08, nullable: false },
] as const

export const PRODUCTION_THRESHOLD = 7.0

// Redistribute weight of N/A dimensions proportionally among active ones
export function computeWeightedScore(
  scores: Record<string, number | null>
): number {
  const active = RUBRIC.filter(d => scores[d.id] !== null && scores[d.id] !== undefined)
  const totalActiveWeight = active.reduce((sum, d) => sum + d.weight, 0)

  if (totalActiveWeight === 0) return 0

  const rawScore = active.reduce((sum, d) => {
    const s = scores[d.id] as number
    return sum + s * (d.weight / totalActiveWeight)
  }, 0)

  return Math.round(rawScore * 10) / 10
}

export type ProjectType = 'Static HTML' | 'App' | 'Fullstack'

export interface EvaluationResult {
  projectType:    ProjectType
  detectedStack:  string
  hostingPlatform: string
  overallScore:   number
  dimensions:     Array<{
    dimension:      Dimension
    score:          number | null   // null = N/A
    justification:  string
  }>
  recommendations: Array<{
    priority: 1 | 2 | 3
    title:    string
    detail:   string
  }>
  hasAgentMemory: boolean  // CLAUDE.md or AGENTS.md present
}
