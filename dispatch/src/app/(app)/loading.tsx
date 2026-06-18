export default function Loading() {
  return (
    <>
      {/* Fixed top bar — an unmistakable, app-wide "working" cue that shows
          the moment a navigation starts, regardless of scroll position. */}
      <div className="nav-progress" role="progressbar" aria-label="Loading page" />
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded-md bg-muted mb-2" />
        <div className="h-4 w-72 rounded-md bg-muted mb-8" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg border bg-muted/40" />
          ))}
        </div>
      </div>
    </>
  )
}
