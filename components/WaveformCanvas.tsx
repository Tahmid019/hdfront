'use client'
import { useEffect, useRef } from 'react'

interface Props {
  data: number[]
  color?: string
  height?: number
  label?: string
  value?: string | number
  unit?: string
}

export default function WaveformCanvas({
  data,
  color = '#1A1A1A',
  height = 80,
  label,
  value,
  unit,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bufRef   = useRef<number[]>([])

  useEffect(() => {
    if (data.length) {
      bufRef.current = [...bufRef.current, ...data].slice(-300)
    }
  }, [data])

  useEffect(() => {
    let raf: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const draw = () => {
      const w = canvas.width  = canvas.offsetWidth
      const h = canvas.height = height

      ctx.clearRect(0, 0, w, h)

      const buf = bufRef.current
      if (buf.length < 2) { raf = requestAnimationFrame(draw); return }

      const min = Math.min(...buf)
      const max = Math.max(...buf)
      const range = max - min || 1
      const pad = h * 0.1

      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth   = 1.5
      ctx.lineJoin    = 'round'
      ctx.lineCap     = 'round'

      buf.forEach((v, i) => {
        const x = (i / (buf.length - 1)) * w
        const y = pad + ((max - v) / range) * (h - pad * 2)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [color, height])

  return (
    <div className="relative w-full" style={{ height }}>
      {value !== undefined && (
        <div className="absolute top-0 right-0 text-right pointer-events-none z-10">
          <span className="text-2xl font-bold font-mono">{value}</span>
          {unit && <span className="text-xs text-muted ml-1">{unit}</span>}
        </div>
      )}
      <canvas ref={canvasRef} className="w-full" style={{ height }} />
    </div>
  )
}
