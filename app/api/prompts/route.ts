import { NextRequest, NextResponse } from 'next/server'
import { insertPrompt, getAllPrompts } from '@/lib/supabase'
import type { Prompt } from '@/types'

export async function GET() {
  const prompts = await getAllPrompts()
  return NextResponse.json(prompts)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<Prompt, 'id' | 'created_at'>

  if (!body.title || !body.prompt_text || !body.source_url) {
    return NextResponse.json(
      { error: 'title, prompt_text, and source_url are required' },
      { status: 400 }
    )
  }

  const prompt = await insertPrompt({
    title: body.title,
    prompt_text: body.prompt_text,
    source_url: body.source_url,
    category: body.category ?? 'other',
    tags: body.tags ?? [],
    output_type: body.output_type ?? 'text',
    output_url: body.output_url,
    output_description: body.output_description,
    notes: body.notes,
  })

  if (!prompt) {
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
  }

  return NextResponse.json(prompt, { status: 201 })
}
