import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
})

export const metadata: Metadata = {
  title: "Dispatch — Turn AI chaos into a system your team can run on",
  description:
    "Dispatch centralizes your prompts, workflows, tools, and outputs into one structured platform. Organize, amplify, and protect how your team uses AI.",
  openGraph: {
    title: "Dispatch — The AI Operating System for Your Business",
    description:
      "One platform to organize, amplify, and protect how your team uses AI.",
    url: "https://dispatchvault.com",
    siteName: "Dispatch",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  )
}
