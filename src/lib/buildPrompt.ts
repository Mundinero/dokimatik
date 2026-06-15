import type { ParsedProject } from './parseZip'

export function buildPrompt(project: ParsedProject): string {
  const p: string[] = []

  p.push('You are a senior software engineer evaluating a vibe-coded project for production readiness.')
  p.push('Analyze the project below and return a JSON evaluation. Return ONLY valid JSON — no markdown fences, no explanation.\n')

  p.push('## FILE TREE')
  p.push(project.fileTree.slice(0, 80).join('\n'))
  p.push('')

  for (const [path, content] of Object.entries(project.keyFiles)) {
    p.push(`## ${path}`)
    p.push(content)
    p.push('')
  }

  const codeEntries = Object.entries(project.codeSnippets)
  if (codeEntries.length > 0) {
    p.push(`## CODE SAMPLES (${codeEntries.length} files · first 60 lines each)`)
    for (const [path, content] of codeEntries) {
      p.push(`### ${path}\n${content}\n`)
    }
  }

  p.push('## RUBRIC — 9 DIMENSIONS')
  p.push('Score 0–10 (float). Use null for truly N/A dimensions (e.g. no database → database=null).\n')
  p.push('- structure (0.15): directory layout, separation of concerns, naming conventions')
  p.push('- dependencies (0.12, nullable): dependency file quality, pinned versions, no unused/risky packages')
  p.push('- env_vars (0.12, nullable): .env.example present, no hardcoded secrets, documented')
  p.push('- database (0.10, nullable): schema, migrations, connection handling — null if no DB at all')
  p.push('- versioning (0.10): .gitignore quality, no committed secrets, git config')
  p.push('- hosting (0.10): deployment config present (vercel.json, Dockerfile, railway.toml…)')
  p.push('- security (0.13): input validation, auth, no exposed credentials, dependency hygiene')
  p.push('- agent_memory (0.10, nullable): CLAUDE.md / AGENTS.md present and useful — null if not an AI-agent project')
  p.push('- error_handling (0.08): try/catch, error boundaries, logging, graceful degradation\n')

  p.push('## REQUIRED JSON SCHEMA (return this exact shape)')
  p.push(`{
  "projectType": "Static HTML" | "App" | "Fullstack",
  "detectedStack": "string — e.g. \\"React + Vite + TypeScript\\"",
  "hostingPlatform": "string — e.g. \\"Vercel\\" or \\"Unknown\\"",
  "dimensions": {
    "structure":      { "score": number,        "justification": "1-2 sentences" },
    "dependencies":   { "score": number | null, "justification": "..." },
    "env_vars":       { "score": number | null, "justification": "..." },
    "database":       { "score": number | null, "justification": "..." },
    "versioning":     { "score": number,        "justification": "..." },
    "hosting":        { "score": number,        "justification": "..." },
    "security":       { "score": number,        "justification": "..." },
    "agent_memory":   { "score": number | null, "justification": "..." },
    "error_handling": { "score": number,        "justification": "..." }
  },
  "recommendations": [
    { "priority": 1, "title": "string", "detail": "string" }
  ],
  "hasAgentMemory": true | false
}`)

  const full = p.join('\n')
  return full.length > 30_000 ? full.slice(0, 30_000) + '\n\n[truncated]' : full
}
