import { RUBRIC, computeWeightedScore } from '../constants/rubric'
import type { EvaluationResult } from '../constants/rubric'
import type { ParsedProject } from './parseZip'
import { buildPrompt } from './buildPrompt'

interface ClaudePayload {
  projectType:     EvaluationResult['projectType']
  detectedStack:   string
  hostingPlatform: string
  dimensions:      Record<string, { score: number | null; justification: string }>
  recommendations: Array<{ priority: 1 | 2 | 3; title: string; detail: string }>
  hasAgentMemory:  boolean
}

export async function evaluate(project: ParsedProject, lang: 'en' | 'es' = 'en'): Promise<EvaluationResult> {
  const raw = await callApi(buildPrompt(project, lang))

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

async function callApi(prompt: string): Promise<string> {
  // Dev: call Claude API directly from browser
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

  // Production: Vercel Function proxies the key
  const res = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) throw new Error(`/api/evaluate ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.text as string
}
