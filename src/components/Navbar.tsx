import { useLanguage } from '../context/LanguageContext'
import type { Lang } from '../constants/i18n'

// Altura total del navbar flotante: 10px padding-top + 86px pill + 10px padding-bottom
export const NAVBAR_HEIGHT = 106

export function Navbar() {
  const { lang, setLang } = useLanguage()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 20px',
        // Outer wrapper invisible to clicks — solo la píldora captura interacción
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'all',
          width: '100%',
          maxWidth: '989px',
          height: '86px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          background: 'rgba(7,8,10,0.72)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          // Doble sombra: borde sutil + sombra de profundidad
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.45)',
        }}
      >
        {/* ── Logo + wordmark ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/D_isologo.png"
            alt="Dokimatik"
            style={{ height: '51px', width: 'auto', display: 'block' }}
          />
          <span
            className="navbar-version"
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: '#4a4b4c',
              background: 'rgba(17,18,20,0.9)',
              border: '1px solid rgba(54,55,57,0.5)',
              borderRadius: '5px',
              padding: '1px 6px',
            }}
          >
            v0.1
          </span>
        </div>

        {/* ── Right actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="navbar-monexus"
            style={{
              fontSize: '11px',
              color: '#3a3b3c',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Monexus
          </span>

          <span className="navbar-divider-monexus"><Divider /></span>
          <LangToggle current={lang} onChange={setLang} />
          <Divider />

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              color: '#4a4b4c',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#4a4b4c'
              e.currentTarget.style.background = 'transparent'
            }}
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </nav>
    </header>
  )
}

function LangToggle({ current, onChange }: { current: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(54,55,57,0.4)',
        borderRadius: '7px',
        padding: '2px',
        gap: '1px',
      }}
    >
      {(['en', 'es'] as Lang[]).map(l => {
        const active = current === l
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            style={{
              fontFamily: '"Satoshi", system-ui, sans-serif',
              fontWeight: active ? 700 : 500,
              fontSize: '11px',
              letterSpacing: '0.05em',
              padding: '3px 9px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
              background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: active ? '#ffffff' : '#3a3b3c',
            }}
          >
            {l.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

function Divider() {
  return (
    <div style={{ width: '1px', height: '14px', background: 'rgba(54,55,57,0.5)' }} />
  )
}


function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
