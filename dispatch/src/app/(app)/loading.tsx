export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded-md bg-muted mb-2" />
      <div className="h-4 w-72 rounded-md bg-muted mb-8" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg border bg-muted/40" />
        ))}
      </div>
    </div>
  )
}
