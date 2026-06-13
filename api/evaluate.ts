export const config = { runtime: 'nodejs' }

export default async function handler(
  req: { method: string; body: { prompt?: string } },
  res: { status: (n: number) => { json: (o: unknown) => void } },
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 2048,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!upstream.ok) {
    return res.status(502).json({ error: `Claude error ${upstream.status}` })
  }

  const data = await upstream.json() as { content: Array<{ text: string }> }
  return res.status(200).json({ text: data.content[0].text })
}
