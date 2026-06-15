import { useState, useRef, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { HeroDropzone } from './components/HeroDropzone'
import { ScorecardShell } from './components/ScorecardShell'
import { Scorecard } from './components/Scorecard'
import { parseZip } from './lib/parseZip'
import { evaluate } from './lib/callClaude'
import { useLanguage } from './context/LanguageContext'
import type { EvaluationResult } from './constants/rubric'

export default function App() {
  const { lang } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [result,    setResult   ] = useState<EvaluationResult | null>(null)
  const [error,     setError    ] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleFileSelected = useCallback(async (file: File) => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const parsed     = await parseZip(file)
      const evaluation = await evaluate(parsed, lang)
      setResult(evaluation)
      // Scroll after result is ready so the user sees the scorecard with data
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }, 120)
    } catch (err) {
      console.error('Evaluation failed:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [lang])

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
