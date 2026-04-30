'use client'

import { useRouter } from 'next/navigation'
import { ExternalLink, Tag, ArrowLeft, Image as ImageIcon, Video, FileText, Zap, Star } from 'lucide-react'
import type { Prompt, OutputType } from '@/types'

const OUTPUT_ICONS: Record<OutputType, React.ReactNode> = {
  text: <FileText size={12} />,
  image: <ImageIcon size={12} />,
  video: <Video size={12} />,
  skill: <Star size={12} />,
  routine: <Zap size={12} />,
  other: <FileText size={12} />,
}

const OUTPUT_LABELS: Record<OutputType, string> = {
  text: 'טקסט', image: 'תמונה', video: 'סרטון', skill: 'סקיל', routine: 'רוטינה', other: 'אחר',
}

const CATEGORY_COLORS: Record<string, string> = {
  coding: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  writing: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'image-gen': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  'video-gen': 'bg-red-500/15 text-red-400 border-red-500/30',
  productivity: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  learning: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  business: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  other: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const router = useRouter()
  const categoryColor = CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS.other
  const previewText = prompt.prompt_text.slice(0, 160) + (prompt.prompt_text.length > 160 ? '…' : '')

  return (
    <div
      onClick={() => router.push(`/prompt/${prompt.id}`)}
      className="group cursor-pointer block bg-[#0d1526] border border-sky-900/30 hover:border-sky-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-0.5"
    >
      {/* שורה עליונה */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white text-sm font-semibold leading-tight group-hover:text-sky-300 transition-colors line-clamp-2">
          {prompt.title}
        </h3>
        <span className={`shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColor}`}>
          {OUTPUT_ICONS[prompt.output_type]}
          <span>{OUTPUT_LABELS[prompt.output_type]}</span>
        </span>
      </div>

      {/* תצוגה מקדימה של הפרומפט */}
      <div className="bg-[#0b1220] rounded-lg p-3 mb-3 border border-sky-900/20">
        <p className="text-slate-400 text-xs font-mono leading-relaxed line-clamp-3" dir="auto">
          {previewText}
        </p>
      </div>

      {/* תמונה */}
      {prompt.output_type === 'image' && prompt.output_url && (
        <div className="mb-3 rounded-lg overflow-hidden border border-sky-900/20 h-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={prompt.output_url} alt="תצוגה מקדימה" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
        </div>
      )}

      {/* תגיות */}
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {prompt.tags.slice(0, 4).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded" dir="ltr">
              <Tag size={9} />
              {tag}
            </span>
          ))}
          {prompt.tags.length > 4 && (
            <span className="text-[10px] text-slate-600">+{prompt.tags.length - 4} נוספות</span>
          )}
        </div>
      )}

      {/* פוטר */}
      <div className="flex items-center justify-between pt-2 border-t border-sky-900/20">
        <a href={prompt.source_url} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-sky-400 transition-colors">
          <ExternalLink size={10} />
          <span>מקור</span>
        </a>
        <span className="flex items-center gap-1 text-[10px] text-sky-500/60 group-hover:text-sky-400 transition-colors">
          צפה בפרומפט <ArrowLeft size={10} />
        </span>
      </div>
    </div>
  )
}
