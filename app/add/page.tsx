'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { ArrowRight, Plus, Loader2 } from 'lucide-react'
import type { Category, OutputType } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'coding', label: 'קוד ופיתוח' },
  { value: 'writing', label: 'כתיבה' },
  { value: 'image-gen', label: 'יצירת תמונות' },
  { value: 'video-gen', label: 'יצירת סרטונים' },
  { value: 'productivity', label: 'פרודקטיביות' },
  { value: 'learning', label: 'למידה' },
  { value: 'business', label: 'עסקים' },
  { value: 'other', label: 'אחר' },
]

const OUTPUT_TYPES: { value: OutputType; label: string }[] = [
  { value: 'text', label: 'טקסט' },
  { value: 'image', label: 'תמונה' },
  { value: 'video', label: 'סרטון' },
  { value: 'skill', label: 'סקיל' },
  { value: 'routine', label: 'רוטינה' },
  { value: 'other', label: 'אחר' },
]

export default function AddPromptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const [form, setForm] = useState({
    title: '',
    prompt_text: '',
    source_url: '',
    category: 'other' as Category,
    output_type: 'text' as OutputType,
    output_url: '',
    output_description: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'אירעה שגיאה')
      setLoading(false)
      return
    }

    const prompt = await res.json()
    router.push(`/prompt/${prompt.id}`)
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-sky-900/20 px-6 py-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors w-fit">
            <ArrowRight size={13} /> חזרה לכספת
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">הוסף פרומפט</h1>
            <p className="text-slate-500 text-sm">שמור פרומפט מדהים לכספת שלך</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="כותרת *">
              <input required value={form.title} onChange={e => update('title', e.target.value)}
                placeholder="שם קצר ותיאורי לפרומפט"
                className={INPUT_CLS} />
            </Field>

            <Field label="טקסט הפרומפט *">
              <textarea required value={form.prompt_text} onChange={e => update('prompt_text', e.target.value)}
                placeholder="הדבק כאן את הפרומפט המלא…"
                rows={8} dir="auto"
                className={INPUT_CLS + ' font-mono text-xs resize-y'} />
            </Field>

            <Field label="קישור מקור *">
              <input required type="url" value={form.source_url} onChange={e => update('source_url', e.target.value)}
                placeholder="https://…" dir="ltr"
                className={INPUT_CLS + ' text-left'} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="קטגוריה">
                <select value={form.category} onChange={e => update('category', e.target.value)} className={INPUT_CLS}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="סוג תוצר">
                <select value={form.output_type} onChange={e => update('output_type', e.target.value)} className={INPUT_CLS}>
                  {OUTPUT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="תגיות (מופרדות בפסיקים)">
              <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="midjourney, photography, portrait" dir="ltr"
                className={INPUT_CLS + ' text-left placeholder:text-right'} />
            </Field>

            <Field label="קישור לתוצר (אופציונלי)">
              <input type="url" value={form.output_url} onChange={e => update('output_url', e.target.value)}
                placeholder="קישור לתמונה / סרטון לדוגמה" dir="ltr"
                className={INPUT_CLS + ' text-left'} />
            </Field>

            <Field label="תיאור התוצר (אופציונלי)">
              <textarea value={form.output_description} onChange={e => update('output_description', e.target.value)}
                placeholder="מה הפרומפט הזה מייצר…" rows={3} dir="auto"
                className={INPUT_CLS + ' resize-y'} />
            </Field>

            <Field label="הערות וטיפים (אופציונלי)">
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
                placeholder="איזה מודל מומלץ, פרמטרים, טריקים…" rows={2} dir="auto"
                className={INPUT_CLS + ' resize-y'} />
            </Field>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {loading ? 'שומר…' : 'שמור פרומפט'}
              </button>
              <Link href="/" className="px-5 py-2.5 text-slate-400 hover:text-slate-200 text-sm rounded-lg border border-sky-900/30 hover:border-sky-900/60 transition-colors">
                ביטול
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

const INPUT_CLS = 'w-full bg-[#0d1526] border border-sky-900/30 focus:border-sky-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
