import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const NEXT_COOKIE = 'lr_auth_next'

function safeNextPath(value: string | undefined): string {
  if (!value) return '/dashboard'

  try {
    const decoded = decodeURIComponent(value)
    return decoded.startsWith('/') && !decoded.startsWith('//') ? decoded : '/dashboard'
  } catch {
    return '/dashboard'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const safeNext = safeNextPath(request.cookies.get(NEXT_COOKIE)?.value)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const response = NextResponse.redirect(`${origin}${safeNext}`)
      response.cookies.delete(NEXT_COOKIE)
      return response
    }
  }

  const response = NextResponse.redirect(`${origin}/login?error=auth_failed`)
  response.cookies.delete(NEXT_COOKIE)
  return response
}
