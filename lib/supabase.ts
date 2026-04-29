import { createClient } from '@supabase/supabase-js'
import type { Prompt } from '@/types'

// 🔧 SETUP: Replace these with your Supabase project values
// Get them from: https://supabase.com → Project Settings → API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function getAllPrompts(): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prompts:', error)
    return MOCK_PROMPTS
  }
  return data as Prompt[]
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return MOCK_PROMPTS.find(p => p.id === id) ?? null
  }
  return data as Prompt
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Prompt[]
}

export async function insertPrompt(prompt: Omit<Prompt, 'id' | 'created_at'>): Promise<Prompt | null> {
  const { data, error } = await supabase
    .from('prompts')
    .insert(prompt)
    .select()
    .single()

  if (error) {
    console.error('Error inserting prompt:', error)
    return null
  }
  return data as Prompt
}

export async function deletePrompt(id: string): Promise<boolean> {
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  return !error
}

// Mock data shown while Supabase is not yet connected
const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'mock-1',
    title: 'Ultra-Detailed Image Generation Prompt',
    prompt_text: `Create a hyper-realistic photograph of a futuristic city at golden hour.
The scene should include:
- Towering glass skyscrapers with holographic advertisements
- Flying vehicles leaving light trails
- Street level with diverse pedestrians
- Warm orange and pink sky reflected in glass surfaces
Style: photorealistic, 8K resolution, cinematic lighting, shallow depth of field`,
    source_url: 'https://example.com/amazing-prompts',
    category: 'image-gen',
    tags: ['midjourney', 'photography', 'futuristic', 'cityscape'],
    output_type: 'image',
    output_url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
    output_description: 'Stunning futuristic cityscape generated with Midjourney v6',
    notes: 'Works best with Midjourney --ar 16:9 --v 6',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Senior Engineer Code Review Prompt',
    prompt_text: `You are a senior software engineer with 15 years of experience.
Review the following code with focus on:
1. Security vulnerabilities (OWASP Top 10)
2. Performance bottlenecks
3. Code maintainability and readability
4. Edge cases not handled
5. Better architectural patterns

Be specific, reference line numbers, and provide corrected code snippets.
Code to review:
\`\`\`
[PASTE CODE HERE]
\`\`\``,
    source_url: 'https://example.com/dev-prompts',
    category: 'coding',
    tags: ['code-review', 'engineering', 'security', 'best-practices'],
    output_type: 'text',
    output_description: 'Detailed code review with security analysis and refactoring suggestions',
    notes: 'Use with Claude Opus or GPT-4 for best results',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Personal Productivity System Builder',
    prompt_text: `Design a complete personal productivity system for a [ROLE] who struggles with [MAIN_CHALLENGE].

The system should include:
- Morning routine (15-30 min)
- Task prioritization framework
- Deep work blocks structure
- End-of-day review process
- Weekly planning ritual

Make it realistic, not idealistic. Account for bad days, interruptions, and low energy periods.
Format as actionable steps, not advice.`,
    source_url: 'https://example.com/productivity',
    category: 'productivity',
    tags: ['routine', 'gtd', 'productivity', 'planning'],
    output_type: 'routine',
    output_description: 'Complete 30-day productivity system with daily templates',
    created_at: new Date().toISOString(),
  },
]
