'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import type { Category, OutputType } from '@/types'

const CATEGORIES: Category[] = ['coding', 'writing', 'image-gen', 'video-gen', 'productivity', 'learning', 'business', 'other']
const OUTPUT_TYPES: OutputType[] = ['text', 'image', 'video', 'skill', 'routine', 'other']

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
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    const prompt = await res.json()
    router.push(`/prompt/${prompt.id}`)
  }

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0f1117]/95 backdrop-blur border-b border-sky-900/20 px-6 py-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors w-fit">
            <ArrowLeft size={13} /> Back to vault
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Add Prompt</h1>
            <p className="text-slate-500 text-sm">Save an amazing prompt to your vault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Title *">
              <input
                required value={form.title} onChange={e => update('title', e.target.value)}
                placeholder="Short descriptive name for this prompt"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Prompt Text *">
              <textarea
                required value={form.prompt_text} onChange={e => update('prompt_text', e.target.value)}
                placeholder="Paste the full prompt here…"
                rows={8}
                className={INPUT_CLS + ' font-mono text-xs resize-y'}
              />
            </Field>

            <Field label="Source URL *">
              <input
                required type="url" value={form.source_url} onChange={e => update('source_url', e.target.value)}
                placeholder="https://…"
                className={INPUT_CLS}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select value={form.category} onChange={e => update('category', e.target.value)} className={INPUT_CLS}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                </select>
              </Field>
              <Field label="Output Type">
                <select value={form.output_type} onChange={e => update('output_type', e.target.value)} className={INPUT_CLS}>
                  {OUTPUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Tags (comma separated)">
              <input
                value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="midjourney, photography, portrait"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Output URL (optional)">
              <input
                type="url" value={form.output_url} onChange={e => update('output_url', e.target.value)}
                placeholder="Link to example output image/video"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Output Description (optional)">
              <textarea
                value={form.output_description} onChange={e => update('output_description', e.target.value)}
                placeholder="Describe what the prompt produces…"
                rows={3}
                className={INPUT_CLS + ' resize-y'}
              />
            </Field>

            <Field label="Notes & Tips (optional)">
              <textarea
                value={form.notes} onChange={e => update('notes', e.target.value)}
                placeholder="Best model to use, parameters, tricks…"
                rows={2}
                className={INPUT_CLS + ' resize-y'}
              />
            </Field>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {loading ? 'Saving…' : 'Save Prompt'}
              </button>
              <Link href="/" className="px-5 py-2.5 text-slate-400 hover:text-slate-200 text-sm rounded-lg border border-sky-900/30 hover:border-sky-900/60 transition-colors">
                Cancel
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
      <label className="block text-xs font-medium text-slate-400 mb-1.5 capitalize">{label}</label>
      {children}
    </div>
  )
}
