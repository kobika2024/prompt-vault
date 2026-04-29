'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles, Code2, PenLine, ImageIcon, Video,
  Briefcase, BookOpen, Zap, LayoutGrid, ChevronRight
} from 'lucide-react'
import type { Category } from '@/types'

const categories: { key: Category | 'all'; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'all', label: 'All Prompts', icon: <LayoutGrid size={16} />, color: 'text-sky-400' },
  { key: 'coding', label: 'Coding', icon: <Code2 size={16} />, color: 'text-emerald-400' },
  { key: 'writing', label: 'Writing', icon: <PenLine size={16} />, color: 'text-violet-400' },
  { key: 'image-gen', label: 'Image Gen', icon: <ImageIcon size={16} />, color: 'text-pink-400' },
  { key: 'video-gen', label: 'Video Gen', icon: <Video size={16} />, color: 'text-red-400' },
  { key: 'productivity', label: 'Productivity', icon: <Zap size={16} />, color: 'text-yellow-400' },
  { key: 'learning', label: 'Learning', icon: <BookOpen size={16} />, color: 'text-blue-400' },
  { key: 'business', label: 'Business', icon: <Briefcase size={16} />, color: 'text-orange-400' },
  { key: 'other', label: 'Other', icon: <Sparkles size={16} />, color: 'text-slate-400' },
]

interface SidebarProps {
  activeCategory?: string
  counts?: Record<string, number>
  totalCount?: number
}

export default function Sidebar({ activeCategory = 'all', counts = {}, totalCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <aside className="w-60 min-h-screen bg-[#0a0e1a] border-r border-sky-900/30 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-sky-900/30">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Sparkles size={16} className="text-sky-400" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm tracking-wide">PromptVault</span>
            <p className="text-sky-400/60 text-[10px] tracking-widest uppercase">by kobi76</p>
          </div>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="px-5 py-3 border-b border-sky-900/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Total saved</span>
          <span className="text-sky-400 font-mono font-semibold">{totalCount}</span>
        </div>
        <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalCount / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-slate-600 text-[10px] mt-1">{100 - totalCount} slots to your first 100</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
          Categories
        </p>
        {categories.map(({ key, label, icon, color }) => {
          const count = key === 'all' ? totalCount : (counts[key] ?? 0)
          const isActive = isHome && activeCategory === key

          return (
            <Link
              key={key}
              href={key === 'all' ? '/' : `/?category=${key}`}
              className={`
                flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all group
                ${isActive
                  ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                  : 'text-slate-400 hover:bg-sky-500/8 hover:text-slate-200 border border-transparent'
                }
              `}
            >
              <span className={`${color} ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {icon}
              </span>
              <span className="flex-1 text-xs font-medium">{label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
              {isActive && <ChevronRight size={12} className="text-sky-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sky-900/30">
        <Link
          href="/add"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 hover:border-sky-400/60 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-medium transition-all"
        >
          <span>+ Add Prompt</span>
        </Link>
      </div>
    </aside>
  )
}
