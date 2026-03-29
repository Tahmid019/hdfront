'use client'
import { Bell, Search, Settings, Menu } from 'lucide-react'

interface Props {
  physician: string
  onMenuClick: () => void
}

export default function Topbar({ physician, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-dark text-white flex items-center justify-between px-4 md:px-6 h-12 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-white/70 hover:text-white p-1">
          <Menu size={20} />
        </button>
        <span className="font-bold tracking-wide text-sm md:text-base">HEMO-SYNC PRO</span>
        <span className="hidden md:block w-px h-4 bg-white/20" />
        <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
          <span className="w-2 h-2 rounded-full bg-accent inline-block" />
          {physician}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Bell   size={18} /></button>
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Search size={18} /></button>
        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Settings size={18} /></button>
      </div>
    </header>
  )
}
