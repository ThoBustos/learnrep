import { createClient } from '@supabase/supabase-js'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'

const CONFIG_DIR = path.join(os.homedir(), '.config', 'learnrep')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000

export interface AuthConfig {
  access_token: string
  refresh_token: string
  expires_at: number
  user: { id: string; email: string }
  supabaseUrl: string
  supabaseAnonKey: string
}

export function readConfig(): AuthConfig | null {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) as AuthConfig
  } catch {
    return null
  }
}

export function writeConfig(config: AuthConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 })
}

export function clearConfig(): void {
  try {
    fs.unlinkSync(CONFIG_FILE)
  } catch {
    // already gone
  }
}

export function openBrowser(url: string): void {
  const [bin, args]: [string, string[]] =
    process.platform === 'darwin' ? ['open', [url]] :
    process.platform === 'win32'  ? ['cmd', ['/c', 'start', '', url]] :
                                    ['xdg-open', [url]]
  execFile(bin, args, () => {}) // ignore open errors — URL is printed to terminal as fallback
}

// Returns a valid access token, refreshing via Supabase if the stored one is within 60s of expiry.
export async function getValidToken(apiBase: string): Promise<string> {
  const config = readConfig()
  if (!config) throw new Error('Not logged in. Run: lr login')

  if (Date.now() / 1000 < config.expires_at - 60) {
    return config.access_token
  }

  let supabaseUrl = config.supabaseUrl
  let supabaseAnonKey = config.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    // Legacy config written before these fields were added — re-fetch from server.
    const fetched = await fetchSupabaseConfig(apiBase)
    supabaseUrl = fetched.supabaseUrl
    supabaseAnonKey = fetched.supabaseAnonKey
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: false },
  })
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: config.refresh_token })
  if (error || !data.session) throw new Error('Session expired. Run: lr login')

  const updated: AuthConfig = {
    ...config,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at ?? 0,
    supabaseUrl,
    supabaseAnonKey,
  }
  writeConfig(updated)
  return updated.access_token
}

async function fetchSupabaseConfig(apiBase: string): Promise<{ supabaseUrl: string; supabaseAnonKey: string }> {
  let res: Response
  try {
    res = await fetch(`${apiBase}/api/config`)
  } catch {
    throw new Error(`Could not reach ${apiBase}. Is LEARNREP_API_URL set correctly?`)
  }
  if (!res.ok) throw new Error(`Server returned ${res.status}`)
  return res.json() as Promise<{ supabaseUrl: string; supabaseAnonKey: string }>
}

export async function login(apiBase: string): Promise<AuthConfig> {
  const { supabaseUrl, supabaseAnonKey } = await fetchSupabaseConfig(apiBase)

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured on the server. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  // In-memory storage so the SDK can persist the PKCE code_verifier between
  // signInWithOAuth and exchangeCodeForSession within the same process.
  const store = new Map<string, string>()
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
      persistSession: false,
      storage: {
        getItem: (key) => store.get(key) ?? null,
        setItem: (key, value) => { store.set(key, value) },
        removeItem: (key) => { store.delete(key) },
      },
    },
  })

  return new Promise((resolve, reject) => {
    const port = 49152 + Math.floor(Math.random() * 16383)
    const redirectUri = `http://localhost:${port}/callback`

    const server = createServer(async (req, res) => {
      if (!req.url?.startsWith('/callback')) {
        res.end()
        return
      }

      const callbackUrl = new URL(req.url, `http://localhost:${port}`)
      const code = callbackUrl.searchParams.get('code')
      const error = callbackUrl.searchParams.get('error')

      const respond = (html: string, err?: Error) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
        server.close()
        if (err) reject(err)
      }

      if (error || !code) {
        respond(
          page('Authentication failed', 'You can close this tab and try <code>lr login</code> again.'),
          new Error(error ?? 'No code returned from OAuth provider'),
        )
        return
      }

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError || !data.session) {
        respond(
          page('Session exchange failed', 'You can close this tab and try <code>lr login</code> again.'),
          exchangeError ?? new Error('No session returned'),
        )
        return
      }

      const config: AuthConfig = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at ?? 0,
        user: { id: data.user.id, email: data.user.email ?? '' },
        supabaseUrl,
        supabaseAnonKey,
      }

      respond(page('Logged in!', 'You can close this tab and return to your terminal.'))
      resolve(config)
    })

    server.listen(port, async () => {
      const { data, error: urlError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      })

      if (urlError || !data.url) {
        server.close()
        reject(urlError ?? new Error('Could not get OAuth URL from Supabase'))
        return
      }

      console.log('\nOpening browser for Google login...')
      console.log(`If the browser doesn't open, visit:\n  ${data.url}\n`)
      openBrowser(data.url)
    })

    server.on('error', (err) => {
      reject(new Error(`Could not start local callback server: ${err.message}`))
    })

    setTimeout(() => {
      server.close()
      reject(new Error('Login timed out after 5 minutes'))
    }, LOGIN_TIMEOUT_MS)
  })
}

function page(heading: string, body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:monospace;padding:2rem;background:#ffd426">
<h2 style="font-weight:900">${heading}</h2><p>${body}</p></body></html>`
}
