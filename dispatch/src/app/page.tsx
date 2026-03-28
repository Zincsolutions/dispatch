import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <img src="/logo-dispatch.svg" alt="Dispatch" style={{ height: 40 }} />
      <h1 className="text-2xl font-semibold tracking-tight">Dispatch</h1>
      <Link href="/dashboard" className={buttonVariants()}>
        Go to Dashboard
      </Link>
    </div>
  )
}
