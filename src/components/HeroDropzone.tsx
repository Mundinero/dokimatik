import { useState, useCallback, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { DotGrid } from './DotGrid'

interface HeroDropzoneProps {
  onFileSelected: (file: File) => void
  isLoading: boolean
  error?: string | null
}

export function HeroDropzone({ onFileSelected, isLoading, error }: HeroDropzoneProps) {
  const { t } = useLanguage()
  const h = t.hero
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.name.endsWith('.zip')) onFileSelected(file)
    },
    [onFileSelected]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <section
      style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '106px',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid — interactive, detrás de todo el contenido */}
      <DotGrid />

      {/* Atmosphere — gradiente amplio, multi-stop + blur elimina banding */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-60px',
          background: `
            radial-gradient(ellipse 110% 70% at 50% -5%,
              rgba(240,61,48,0.32) 0%,
              rgba(210,42,32,0.20) 22%,
              rgba(140,22,16,0.09) 50%,
              rgba(55,8,6,0.03)   76%,
              transparent          100%
            ),
            radial-gradient(ellipse 140% 100% at 50% 10%,
              rgba(100,16,12,0.18)   0%,
              rgba(52,8,6,0.07)    40%,
              transparent          70%
            )
          `,
          filter: 'blur(36px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Eyebrow */}
      <div
        className="animate-fade-in"
        style={{ position: 'relative', marginBottom: '20px' }}
      >
        <span
          style={{
            fontFamily: '"Satoshi", system-ui, sans-serif',
            fontSize: '17.5px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#f03d30',
            textShadow: '0 0 18px rgba(240,61,48,0.55), 0 0 40px rgba(220,42,32,0.25)',
          }}
        >
          {h.eyebrow}
        </span>
      </div>

      {/* Headline — flex wrap: una línea en pantallas anchas,
           rompe exactamente en el punto intermedio en pantallas angostas */}
      <h1
        className="animate-fade-in hero-headline"
        style={{
          animationDelay: '60ms',
          position: 'relative',
          fontFamily: '"Satoshi", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(30px, 6vw, 64px)',
          letterSpacing: '-0.06px',
          color: '#ffffff',
          textAlign: 'center',
          margin: '0 0 16px',
          lineHeight: 1.1,
          padding: '0 16px',
        }}
      >
        <span className="hero-headline-s1">
          {h.headline_pre}
          <span style={{ color: '#f03d30' }}>{h.headline_accent}</span>
          {h.headline_post}
        </span>
        <span className="hero-headline-s2">{h.headline_part2}</span>
      </h1>

      {/* Subheading */}
      <p
        className="animate-fade-in"
        style={{
          animationDelay: '120ms',
          position: 'relative',
          fontSize: 'clamp(13px, 2.5vw, 16px)',
          fontWeight: 400,
          color: '#9c9c9d',
          textAlign: 'center',
          maxWidth: '440px',
          lineHeight: 1.65,
          margin: '0 0 40px',
          padding: '0 20px',
        }}
      >
        {h.subheading}
      </p>

      {/* Drop zone */}
      <div
        className="animate-fade-in"
        style={{
          animationDelay: '180ms',
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          padding: '0 16px',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={h.dropzone_idle}
          onClick={() => !isLoading && inputRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && !isLoading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            cursor: isLoading ? 'default' : 'pointer',
            border: `1.5px dashed ${isDragging ? 'rgba(240,61,48,0.55)' : 'rgba(54,55,57,0.8)'}`,
            borderRadius: '11px',
            padding: '40px 32px',
            background: isDragging ? 'rgba(240,61,48,0.04)' : 'rgba(7,8,10,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
            boxShadow: isDragging
              ? '0 0 0 4px rgba(240,61,48,0.07), 0 4px 24px rgba(0,0,0,0.4)'
              : '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {isLoading ? <LoadingSpinner /> : <UploadIcon dragging={isDragging} />}

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontWeight: 500,
                fontSize: '14px',
                color: isDragging ? '#f03d30' : '#ffffff',
                margin: '0 0 4px',
                transition: 'color 0.2s',
              }}
            >
              {isLoading ? h.dropzone_loading : isDragging ? h.dropzone_hover : h.dropzone_idle}
            </p>
            {!isLoading && (
              <p style={{ fontSize: '12px', color: '#6a6b6c', margin: 0 }}>
                o{' '}
                <span style={{ color: '#f03d30', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                  {h.dropzone_select}
                </span>
                {' '}{h.dropzone_hint}
              </p>
            )}
          </div>

          {!isLoading && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '4px',
              }}
            >
              {['package.json', '.env.example', 'CLAUDE.md', 'Dockerfile'].map(f => (
                <span
                  key={f}
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: '10px',
                    color: '#6a6b6c',
                    background: '#111214',
                    border: '1px solid #363739',
                    borderRadius: '4px',
                    padding: '2px 6px',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={handleChange}
          aria-hidden="true"
        />
      </div>

      {/* Error message */}
      {error && !isLoading && (
        <div
          className="animate-fade-in"
          style={{
            position: 'relative',
            marginTop: '16px',
            padding: '10px 16px',
            background: 'rgba(240,61,48,0.06)',
            border: '1px solid rgba(240,61,48,0.2)',
            borderRadius: '8px',
            maxWidth: '520px',
            width: '100%',
          }}
        >
          <p style={{ fontSize: '12px', color: '#f03d30', margin: 0, textAlign: 'center' }}>
            {error}
          </p>
        </div>
      )}

      {/* Trust line */}
      {!isLoading && !error && (
        <p
          className="animate-fade-in"
          style={{
            animationDelay: '240ms',
            position: 'relative',
            marginTop: '24px',
            fontSize: '12px',
            color: '#6a6b6c',
            textAlign: 'center',
          }}
        >
          {h.trust}
        </p>
      )}

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: '10px',
            color: '#2a2b2c',
            letterSpacing: '0.07em',
          }}
        >
          {h.scroll_hint}
        </span>
        <ChevronDown />
      </div>
    </section>
  )
}

function UploadIcon({ dragging }: { dragging: boolean }) {
  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: '#111214',
        border: `1px solid ${dragging ? 'rgba(240,61,48,0.3)' : '#363739'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.2s',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={dragging ? '#f03d30' : '#9c9c9d'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke 0.2s' }}
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: '#111214',
        border: '1px solid rgba(240,61,48,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f03d30"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <path d="M12 2a10 10 0 1 0 10 10" />
      </svg>
    </div>
  )
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2a2b2c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ animation: 'bounce 2s ease-in-out infinite' }}
    >
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(3px)} }`}</style>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
