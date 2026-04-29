-- PromptVault Schema
-- Run this in your Supabase SQL Editor

create table if not exists prompts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  prompt_text text not null,
  source_url text not null,
  category text not null default 'other',
  tags text[] default '{}',
  output_type text not null default 'text',
  output_url text,
  output_description text,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table prompts enable row level security;

-- Allow all operations (single-user personal app)
create policy "Allow all operations" on prompts
  for all using (true) with check (true);

-- Index for faster category filtering
create index prompts_category_idx on prompts(category);
create index prompts_created_at_idx on prompts(created_at desc);
