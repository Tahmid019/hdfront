'use client'
import { LayoutDashboard, Users, BarChart2, BookOpen, Archive, HelpCircle, LogOut, X } from 'lucide-react'

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard',  active: true },
  { icon: Users,           label: 'Patients',   active: false },
  { icon: BarChart2,       label: 'Analytics',  active: false },
  { icon: BookOpen,        label: 'Protocols',  active: false },
  { icon: Archive,         label: 'Archive',    active: false },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-sidebar border-r border-border z-40 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-dark text-accent flex items-center justify-center font-bold text-sm">
              HS
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight">Clinical Hub</div>
              <div className="text-[10px] text-muted uppercase tracking-wider">Hemo-Sync Pro Admin</div>
            </div>
            <button onClick={onClose} className="ml-auto lg:hidden text-muted hover:text-dark">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* new entry */}
        <div className="p-4">
          <button className="w-full bg-dark text-white text-sm font-medium rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 hover:bg-dark/80 transition-colors">
            <span className="text-lg leading-none">+</span> New Entry
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-dark text-white'
                  : 'text-muted hover:bg-border hover:text-dark'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* footer */}
        <div className="p-3 space-y-0.5 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:bg-border hover:text-dark transition-colors">
            <HelpCircle size={18} /> Support
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:bg-border hover:text-dark transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
