import JSZip from 'jszip'

export interface ParsedProject {
  fileTree:     string[]
  keyFiles:     Record<string, string>
  codeSnippets: Record<string, string>
}

const KEY_FILENAMES = new Set([
  'package.json', 'requirements.txt', 'pyproject.toml', 'Pipfile',
  'README.md', 'readme.md', 'README.txt',
  '.env.example', '.env.sample', '.env.local.example',
  'CLAUDE.md', 'AGENTS.md',
  'Dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
  'vercel.json', 'railway.toml', 'netlify.toml',
  '.gitignore', 'tsconfig.json',
])

const CODE_EXTENSIONS   = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rb', '.rs'])
const SKIP_PATTERN      = /node_modules|\.next[/\\]|[/\\]dist[/\\]|[/\\]build[/\\]|[/\\]\.git[/\\]|__pycache__|\.pyc$/
const MAX_CODE_FILES    = 12
const MAX_KEY_BYTES     = 8_000
const MAX_CODE_LINES    = 200

function stripRoot(path: string) {
  return path.replace(/^[^/]+\//, '')
}

export async function parseZip(file: File): Promise<ParsedProject> {
  const zip = await JSZip.loadAsync(file)

  const fileTree:     string[]               = []
  const keyFiles:     Record<string, string> = {}
  const codeSnippets: Record<string, string> = {}
  let   codeCount = 0

  const entries = Object.entries(zip.files).filter(([, f]) => !f.dir)

  for (const [rawPath, zipFile] of entries) {
    const path     = stripRoot(rawPath)
    const filename = path.split('/').pop() ?? ''

    fileTree.push(path)

    if (SKIP_PATTERN.test(path)) continue

    if (KEY_FILENAMES.has(filename)) {
      const text = await zipFile.async('string')
      keyFiles[path] = text.slice(0, MAX_KEY_BYTES)
      continue
    }

    if (codeCount < MAX_CODE_FILES) {
      const ext = filename.match(/\.[^.]+$/)?.[0] ?? ''
      if (CODE_EXTENSIONS.has(ext)) {
        const text = await zipFile.async('string')
        codeSnippets[path] = text.split('\n').slice(0, MAX_CODE_LINES).join('\n')
        codeCount++
      }
    }
  }

  return { fileTree, keyFiles, codeSnippets }
}
