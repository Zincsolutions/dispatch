import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <img src="/logo-dispatch.svg" alt="Dispatch" style={{ height: 40 }} />
      <h1 className="text-2xl font-semibold tracking-tight">Dispatch</h1>
      <div className="flex gap-3">
        <Link href="/login" className={buttonVariants()}>
          Log In
        </Link>
        <Link href="/signup" className={buttonVariants({ variant: "outline" })}>
          Sign Up
        </Link>
      </div>
    </div>
  )
}
