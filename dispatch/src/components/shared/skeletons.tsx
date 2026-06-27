// Reusable loading skeletons for route-segment loading.tsx files. Each renders
// the app-wide top progress bar (an unmistakable "working" cue the moment a
// navigation starts) plus a content skeleton shaped like the page that's
// loading, so clicks feel instant instead of dead.

function NavProgress() {
  return (
    <div className="nav-progress" role="progressbar" aria-label="Loading" />
  )
}

function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-8 w-48 rounded-md bg-muted" />
      <div className="mb-8 h-4 w-72 rounded-md bg-muted" />
    </div>
  )
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      <NavProgress />
      <PageHeaderSkeleton />
      <div className="animate-pulse space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg border bg-muted/40" />
        ))}
      </div>
    </>
  )
}

export function FormSkeleton() {
  return (
    <>
      <NavProgress />
      <PageHeaderSkeleton />
      <div className="max-w-2xl animate-pulse space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 w-full rounded-md border bg-muted/40" />
          </div>
        ))}
        <div className="h-10 w-36 rounded-md bg-muted" />
      </div>
    </>
  )
}

export function DetailSkeleton() {
  return (
    <>
      <NavProgress />
      <PageHeaderSkeleton />
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-full rounded bg-muted/60" />
        <div className="h-4 w-11/12 rounded bg-muted/60" />
        <div className="h-4 w-10/12 rounded bg-muted/60" />
        <div className="mt-6 h-40 rounded-lg border bg-muted/40" />
        <div className="h-4 w-9/12 rounded bg-muted/60" />
        <div className="h-4 w-10/12 rounded bg-muted/60" />
      </div>
    </>
  )
}
