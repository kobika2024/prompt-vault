import { Suspense } from 'react'
import { getAllPrompts } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import PromptCard from '@/components/PromptCard'
import type { Category } from '@/types'
import { Search, SlidersHorizontal } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { category, q } = await searchParams
  const allPrompts = await getAllPrompts()

  const filtered = allPrompts.filter(p => {
    const matchesCategory = !category || category === 'all' || p.category === category
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.prompt_text.toLowerCase().includes(q.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const counts = allPrompts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const activeCategory = (category ?? 'all') as Category | 'all'

  const CATEGORY_LABELS: Record<string, string> = {
    all: 'כל הפרומפטים', coding: 'קוד ופיתוח', writing: 'כתיבה',
    'image-gen': 'יצירת תמונות', 'video-gen': 'יצירת סרטונים',
    productivity: 'פרודקטיביות', learning: 'למידה', business: 'עסקים', other: 'אחר',
  }

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <Sidebar activeCategory={activeCategory} counts={counts} totalCount={allPrompts.length} />

      <main className="flex-1 flex flex-col min-h-screen">
        {/* סרגל עליון */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-sky-900/20 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <form>
                <input
                  type="text" name="q" defaultValue={q}
                  placeholder="חפש פרומפטים, תגיות…"
                  className="w-full bg-[#0d1526] border border-sky-900/30 hover:border-sky-900/60 focus:border-sky-500/50 rounded-lg pr-9 pl-4 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none transition-colors text-right"
                />
              </form>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 bg-[#0d1526] border border-sky-900/30 rounded-lg hover:border-sky-900/60 transition-colors">
              <SlidersHorizontal size={13} />
              סינון
            </button>
          </div>
        </div>

        {/* תוכן */}
        <div className="flex-1 px-6 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">
              {CATEGORY_LABELS[category ?? 'all'] ?? category}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {filtered.length} פרומפט{filtered.length !== 1 ? 'ים' : ''}
              {q && <span> שמכילים <span className="text-sky-400">&quot;{q}&quot;</span></span>}
            </p>
          </div>

          <Suspense fallback={<GridSkeleton />}>
            {filtered.length === 0 ? (
              <EmptyState hasQuery={!!q} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#0d1526] border border-sky-900/30 rounded-xl p-4 animate-pulse h-52" />
      ))}
    </div>
  )
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
        <Search size={24} className="text-sky-500/60" />
      </div>
      <h3 className="text-white font-semibold mb-2">
        {hasQuery ? 'לא נמצאו פרומפטים' : 'הכספת ריקה עדיין'}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs">
        {hasQuery
          ? 'נסה מילות חיפוש אחרות או עיין בכל הקטגוריות.'
          : 'התחל להוסיף פרומפטים מדהימים שמצאת באינטרנט לכספת שלך.'}
      </p>
    </div>
  )
}
