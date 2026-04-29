export type OutputType = 'text' | 'image' | 'video' | 'skill' | 'routine' | 'other'

export type Category =
  | 'coding'
  | 'writing'
  | 'image-gen'
  | 'video-gen'
  | 'productivity'
  | 'learning'
  | 'business'
  | 'other'

export interface Prompt {
  id: string
  title: string
  prompt_text: string
  source_url: string
  category: Category
  tags: string[]
  output_type: OutputType
  output_url?: string
  output_description?: string
  notes?: string
  created_at: string
}
