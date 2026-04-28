import { NextResponse } from 'next/server'

// Public endpoint — CLI calls this to discover Supabase config without hardcoding it in the binary
export function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  })
}
