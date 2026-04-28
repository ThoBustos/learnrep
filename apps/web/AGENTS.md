<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:react-effect-rules -->
# No direct useEffect

Never call `useEffect` directly. Use the right primitive instead:

| Situation | Pattern |
|---|---|
| State derived from other state or props | Compute inline — no hook needed |
| Data fetching | `useQuery` from `@tanstack/react-query` |
| User action triggers a side effect | Put it in the event handler directly |
| One-time external sync (DOM, third-party widget, browser API) | `useMountEffect` from `@/hooks/useMountEffect` |
| "Reset state when ID changes" | Pass `key={id}` to the component instead |

`useMountEffect` is the only sanctioned escape hatch. It wraps `useEffect(fn, [])` explicitly so the intent is clear and ad-hoc effect usage is prevented.

**Why**: dependency arrays hide coupling, create infinite loop risk, and produce implicit synchronization logic that is hard to trace. Every direct `useEffect` is a future race condition waiting to happen.
<!-- END:react-effect-rules -->
