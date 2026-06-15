import { RUBRIC, computeWeightedScore } from '../constants/rubric'
import type { EvaluationResult } from '../constants/rubric'
import type { ParsedProject } from './parseZip'
import { buildPrompt, buildTranslationPrompt } from './buildPrompt'

interface ClaudePayload {
  projectType:     EvaluationResult['projectType']
  detectedStack:   string
  hostingPlatform: string
  dimensions:      Record<string, { score: number | null; justification: string }>
  recommendations: Array<{ priority: 1 | 2 | 3; title: string; detail: string }>
  hasAgentMemory:  boolean
}

interface TranslationPayload {
  dimensions:      Record<string, string>
  recommendations: Array<{ title: string; detail: string }>
}

// Phase 1 — canonical evaluation, always in English, scores are source of truth
export async function evaluate(project: ParsedProject): Promise<EvaluationResult> {
  const raw = await callApi(buildPrompt(project))

  let payload: ClaudePayload
  try {
    payload = JSON.parse(raw)
  } catch {
    const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
    payload = JSON.parse(match?.[1] ?? raw)
  }

  const scoreMap: Record<string, number | null> = {}
  for (const dim of RUBRIC) {
    scoreMap[dim.id] = payload.dimensions[dim.id]?.score ?? null
  }

  return {
    projectType:     payload.projectType,
    detectedStack:   payload.detectedStack,
    hostingPlatform: payload.hostingPlatform,
    overallScore:    computeWeightedScore(scoreMap),
    dimensions:      RUBRIC.map(dim => ({
      dimension:     dim,
      score:         payload.dimensions[dim.id]?.score ?? null,
      justification: payload.dimensions[dim.id]?.justification ?? '',
    })),
    recommendations: (payload.recommendations ?? []).slice(0, 3),
    hasAgentMemory:  payload.hasAgentMemory ?? false,
  }
}

// Phase 2 — lightweight translation of text fields only, scores cloned unchanged
export async function translateEvaluation(canonical: EvaluationResult): Promise<EvaluationResult> {
  const raw = await callApi(buildTranslationPrompt(canonical))

  let t: TranslationPayload
  try {
    t = JSON.parse(raw)
  } catch {
    const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
    t = JSON.parse(match?.[1] ?? raw)
  }

  return {
    ...canonical,
    dimensions: canonical.dimensions.map(d => ({
      ...d,
      justification: t.dimensions[d.dimension.id] ?? d.justification,
    })),
    recommendations: canonical.recommendations.map((r, i) => ({
      ...r,
      title:  t.recommendations[i]?.title  ?? r.title,
      detail: t.recommendations[i]?.detail ?? r.detail,
    })),
  }
}

async function callApi(prompt: string): Promise<string> {
  if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':                               import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version':                       '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
        'content-type':                            'application/json',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 4096,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return data.content[0].text as string
  }

  const res = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) throw new Error(`/api/evaluate ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.text as string
}
