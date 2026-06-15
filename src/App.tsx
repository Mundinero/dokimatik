import { useState, useRef, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { HeroDropzone } from './components/HeroDropzone'
import { ScorecardShell } from './components/ScorecardShell'
import { Scorecard } from './components/Scorecard'
import { parseZip } from './lib/parseZip'
import { evaluate, translateEvaluation } from './lib/callClaude'
import { useLanguage } from './context/LanguageContext'
import type { EvaluationResult } from './constants/rubric'

export default function App() {
  const { lang } = useLanguage()
  const [isLoading,     setIsLoading    ] = useState(false)
  const [resultsByLang, setResultsByLang] = useState<Partial<Record<'en' | 'es', EvaluationResult>>>({})
  const [error,         setError        ] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scores are always from EN (canonical). Text follows the active language.
  // Falls back to EN while ES translation is in progress.
  const result = resultsByLang[lang] ?? resultsByLang['en'] ?? null

  const handleFileSelected = useCallback(async (file: File) => {
    setIsLoading(true)
    setResultsByLang({})
    setError(null)

    try {
      const parsed   = await parseZip(file)

      // Phase 1 — single canonical evaluation in English
      const canonical = await evaluate(parsed)
      setResultsByLang({ en: canonical })
      setIsLoading(false)

      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }, 120)

      // Phase 2 — lightweight translation, non-blocking, scores unchanged
      translateEvaluation(canonical)
        .then(es => setResultsByLang(prev => ({ ...prev, es })))
        .catch(err => console.warn('ES translation failed, falling back to EN:', err))

    } catch (err) {
      console.error('Evaluation failed:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setIsLoading(false)
    }
  }, [])

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#040506' }}>
      <Navbar />

      <div
        ref={scrollRef}
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        <section style={{ height: '100vh', scrollSnapAlign: 'start' }}>
          <HeroDropzone onFileSelected={handleFileSelected} isLoading={isLoading} error={error} />
        </section>

        <section style={{ minHeight: '100vh', scrollSnapAlign: 'start' }}>
          {result
            ? <Scorecard result={result} />
            : <ScorecardShell />
          }
        </section>
      </div>
    </div>
  )
}
