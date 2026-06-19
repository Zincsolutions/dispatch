// Lightweight, provider-agnostic analytics. Events are pushed to the GTM
// dataLayer and forwarded to Plausible / gtag if those are present, so
// tracking fires today and is ready for whatever provider gets wired up later.
// Safe to call during SSR (no-ops on the server).

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return

  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...props })

    if (typeof window.plausible === "function") {
      window.plausible(event, { props })
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", event, props)
    }
  } catch {
    // Never let analytics break the UI.
  }
}
