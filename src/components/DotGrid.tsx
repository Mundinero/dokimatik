import { useEffect, useRef } from 'react'

// ─── Config ──────────────────────────────────────────────────────────────────
const CELL          = 22      // grid cell size px
const FONT_PX       = 11      // character size
const A_BASE        = 0.05    // alpha at rest — barely visible
const A_ACTIVE      = 0.62    // alpha at cursor center
const INFLUENCE     = 155     // cursor influence radius px
const LERP_SPEED    = 0.09    // cursor lag (lower = more delayed)

// Flip intervals ms
const FLIP_SLOW_MIN = 3200
const FLIP_SLOW_MAX = 7500
const FLIP_FAST_MIN = 75
const FLIP_FAST_MAX = 260

interface Cell { value: '0' | '1'; nextFlip: number }

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas  = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let raf: number
    let W = 0, H = 0
    let cells: Cell[][] = []
    let rawX  = -9999, rawY  = -9999
    let lerpX = -9999, lerpY = -9999

    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const bit = (): '0' | '1' => (Math.random() < 0.5 ? '0' : '1')

    // ── Setup ──────────────────────────────────────────────────────────────
    const setup = () => {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width  = W * dpr
      canvas.height = H * dpr
      // setTransform resets previous scale before applying the new one
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(W / CELL) + 1
      const rows = Math.ceil(H / CELL) + 1
      const now  = performance.now()

      // Keep existing cell values when resizing — just grow/shrink the grid
      cells = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ({
          value:    cells[r]?.[c]?.value ?? bit(),
          nextFlip: cells[r]?.[c]?.nextFlip ?? now + rnd(0, FLIP_SLOW_MAX),
        }))
      )
    }

    const ro = new ResizeObserver(setup)
    ro.observe(canvas)
    setup()

    // ── Mouse ──────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      rawX = e.clientX - rect.left
      rawY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMove)

    // ── Draw loop ──────────────────────────────────────────────────────────
    const draw = (now: number) => {
      lerpX += (rawX - lerpX) * LERP_SPEED
      lerpY += (rawY - lerpY) * LERP_SPEED

      ctx.clearRect(0, 0, W, H)
      ctx.font         = `${FONT_PX}px "Geist Mono", monospace`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'

      // Center the grid within the canvas
      const offX = (W % CELL) / 2
      const offY = (H % CELL) / 2

      for (let row = 0; row < cells.length; row++) {
        for (let col = 0; col < cells[row].length; col++) {
          const cell = cells[row][col]
          const x    = offX + col * CELL
          const y    = offY + row * CELL

          // Distance from lerped cursor
          const dx   = x - lerpX
          const dy   = y - lerpY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const t    = Math.max(0, 1 - dist / INFLUENCE)
          // Smoothstep — soft circular falloff, no hard edge
          const ease = t * t * (3 - 2 * t)

          // Characters near the cursor flip fast; far ones drift slowly
          if (!reduced && now >= cell.nextFlip) {
            cell.value    = cell.value === '0' ? '1' : '0'
            cell.nextFlip = ease > 0.06
              ? now + rnd(FLIP_FAST_MIN, FLIP_FAST_MIN + (1 - ease) * (FLIP_FAST_MAX - FLIP_FAST_MIN))
              : now + rnd(FLIP_SLOW_MIN, FLIP_SLOW_MAX)
          }

          const alpha = A_BASE + (A_ACTIVE - A_BASE) * ease
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
          ctx.fillText(cell.value, x, y)
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
