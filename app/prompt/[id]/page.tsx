import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPromptById, getAllPrompts } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import PromptBlock from '@/components/PromptBlock'
import OutputBlock from '@/components/OutputBlock'
import { ArrowRight, ExternalLink, Calendar, Tag } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const prompts = await getAllPrompts()
  return prompts.map(p => ({ id: p.id }))
}

const CATEGORY_LABELS: Record<string, string> = {
  coding: 'קוד ופיתוח', writing: 'כתיבה', 'image-gen': 'יצירת תמונות',
  'video-gen': 'יצירת סרטונים', productivity: 'פרודקטיביות',
  learning: 'למידה', business: 'עסקים', other: 'אחר',
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params
  const prompt = await getPromptById(id)

  if (!prompt) notFound()

  const formattedDate = new Date(prompt.created_at).toLocaleDateString('he-IL', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <Sidebar />

      <main className="flex-1 min-h-screen">
        {/* סרגל עליון */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-sky-900/20 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors">
              <ArrowRight size={13} />
              חזרה לכספת
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs text-slate-500 truncate max-w-xs">{prompt.title}</span>
          </div>
        </div>

        {/* תוכן */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border
                ${prompt.category === 'coding' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  prompt.category === 'image-gen' ? 'bg-pink-500/15 text-pink-400 border-pink-500/30' :
                  prompt.category === 'writing' ? 'bg-violet-500/15 text-violet-400 border-violet-500/30' :
                  'bg-sky-500/15 text-sky-400 border-sky-500/30'
                }`}>
                {CATEGORY_LABELS[prompt.category] ?? prompt.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight mb-3">{prompt.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formattedDate}
              </span>
              <a href={prompt.source_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-500/70 hover:text-sky-400 transition-colors">
                <ExternalLink size={11} />
                מקור מקורי
              </a>
            </div>
          </div>

          {/* תגיות */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {prompt.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full" dir="ltr">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* הפרומפט */}
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">הפרומפט</h2>
            <PromptBlock text={prompt.prompt_text} title={prompt.title} />
          </section>

          {/* תוצר לדוגמה */}
          {(prompt.output_url || prompt.output_description) && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">תוצר לדוגמה</h2>
              <OutputBlock type={prompt.output_type} url={prompt.output_url} description={prompt.output_description} />
            </section>
          )}

          {/* הערות */}
          {prompt.notes && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">הערות וטיפים</h2>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-slate-300 text-sm leading-relaxed">{prompt.notes}</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
