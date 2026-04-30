import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const urlV1 = process.env.SUPABASE_URL
  const keyV1 = process.env.SUPABASE_ANON_KEY
  const urlV2 = process.env.NEXT_PUBLIC_SUPABASE_URL
  const keyV2 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url = urlV1 ?? urlV2 ?? ''
  const key = keyV1 ?? keyV2 ?? ''

  const envReport = {
    SUPABASE_URL: !!urlV1,
    SUPABASE_ANON_KEY: !!keyV1,
    NEXT_PUBLIC_SUPABASE_URL: !!urlV2,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!keyV2,
    resolved_url_prefix: url.slice(0, 35) || '(empty)',
    resolved_key_prefix: key.slice(0, 20) || '(empty)',
  }

  if (!url || !key) {
    return NextResponse.json({ status: 'NO_ENV_VARS', envReport })
  }

  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase.from('prompts').select('count').single()
    return NextResponse.json({ status: 'CONNECTED', envReport, supabase_error: error, supabase_data: data })
  } catch (e) {
    return NextResponse.json({ status: 'EXCEPTION', envReport, exception: String(e) })
  }
}
