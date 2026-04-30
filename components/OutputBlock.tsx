'use client'

import { ExternalLink, Image as ImageIcon, Video, FileText, Zap, Star } from 'lucide-react'
import type { OutputType } from '@/types'

const OUTPUT_CONFIG: Record<OutputType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  text: { label: 'תוצר טקסט', icon: <FileText size={14} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  image: { label: 'תוצר תמונה', icon: <ImageIcon size={14} />, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  video: { label: 'תוצר סרטון', icon: <Video size={14} />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  skill: { label: 'סקיל / כלי', icon: <Star size={14} />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  routine: { label: 'רוטינה / מערכת', icon: <Zap size={14} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  other: { label: 'תוצר', icon: <FileText size={14} />, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
}

interface OutputBlockProps {
  type: OutputType
  url?: string
  description?: string
}

export default function OutputBlock({ type, url, description }: OutputBlockProps) {
  const config = OUTPUT_CONFIG[type]

  return (
    <div className={`rounded-xl border overflow-hidden ${config.bg}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-current/10">
        <div className={`flex items-center gap-2 ${config.color}`}>
          {config.icon}
          <span className="text-xs font-semibold tracking-wide">{config.label}</span>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-1 text-xs ${config.color} hover:opacity-80 transition-opacity`}>
            <ExternalLink size={11} />
            <span>צפה</span>
          </a>
        )}
      </div>

      {type === 'image' && url && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={description ?? 'דוגמת תוצר'} className="w-full max-h-80 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}

      {type === 'video' && url && (
        <div className="aspect-video bg-black/40">
          <iframe src={url} className="w-full h-full" allowFullScreen title="סרטון תוצר" />
        </div>
      )}

      {description && (
        <div className="px-4 py-3">
          <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
        </div>
      )}

      {url && type !== 'image' && type !== 'video' && (
        <div className="px-4 py-3">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className={`text-xs ${config.color} hover:underline break-all font-mono`} dir="ltr">
            {url}
          </a>
        </div>
      )}
    </div>
  )
}
