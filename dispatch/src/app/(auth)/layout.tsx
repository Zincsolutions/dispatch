export const dynamic = "force-dynamic"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dispatch-gray-50 p-4">
      {/* Soft brand wash: yellow glow from the top, teal from the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(253,255,96,0.22),transparent_60%),radial-gradient(ellipse_70%_55%_at_50%_110%,rgba(157,218,215,0.18),transparent_60%)]"
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
