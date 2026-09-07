import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': (code: string) => boolean
      theme: 'light'
      size: 'flexible' | 'compact'
      retry: 'never'
    },
  ) => string
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}
const scriptId = 'diteon-turnstile-script'
let loading: Promise<TurnstileApi> | null = null

/** A shared, bounded script load survives modal remounts without duplicating widgets. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loading) return loading
  loading = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null
    const script = existing ?? document.createElement('script')
    let poll: ReturnType<typeof setInterval> | undefined
    const cleanup = () => {
      clearTimeout(timeout)
      clearInterval(poll)
      script.removeEventListener('error', fail)
      script.removeEventListener('load', ready)
    }
    const fail = () => {
      cleanup()
      script.remove()
      loading = null
      reject(new Error('TURNSTILE_LOAD_FAILED'))
    }
    const ready = () => {
      if (window.turnstile) {
        cleanup()
        resolve(window.turnstile)
      }
    }
    const timeout = setTimeout(fail, 12000)
    script.addEventListener('error', fail, { once: true })
    script.addEventListener('load', ready, { once: true })
    poll = setInterval(ready, 100)
    if (!existing) {
      script.id = scriptId
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })
  return loading
}
export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
  resetKey = 0,
}: {
  siteKey: string
  onVerify: (token: string) => void
  onExpire: () => void
  onError: () => void
  resetKey?: number
}) {
  const container = useRef<HTMLDivElement>(null)
  const callbacks = useRef({ onVerify, onExpire, onError })
  useEffect(() => {
    callbacks.current = { onVerify, onExpire, onError }
  }, [onVerify, onExpire, onError])
  useEffect(() => {
    if (!siteKey.trim()) return
    let cancelled = false
    let widgetId: string | undefined
    let api: TurnstileApi | undefined
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return
        api = turnstile
        widgetId = turnstile.render(container.current, {
          sitekey: siteKey,
          theme: 'light',
          size: container.current.clientWidth < 300 ? 'compact' : 'flexible',
          retry: 'never',
          callback: (token) => {
            if (!cancelled) callbacks.current.onVerify(token)
          },
          'expired-callback': () => {
            if (!cancelled) callbacks.current.onExpire()
          },
          'error-callback': () => {
            if (!cancelled) callbacks.current.onError()
            return true
          },
        })
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onError()
      })
    return () => {
      cancelled = true
      if (api && widgetId !== undefined) {
        try {
          api.remove(widgetId)
        } catch {
          /* Already removed by Turnstile. */
        }
      }
    }
  }, [siteKey, resetKey])
  return (
    <div className="turnstile-container">
      <div ref={container} />
    </div>
  )
}
