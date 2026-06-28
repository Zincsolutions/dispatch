import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Product Tour", href: "/#product" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Talk to Us", href: "/contact" },
      { label: "Start Free Trial", href: "/signup" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <img src="/dispatch-logo-footer.svg" alt="Dispatch" className="h-9 w-auto" />
            </Link>
            <p className="text-[13px] text-white/40 italic leading-relaxed">
              The system of record for AI.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.15em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/40 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] mt-16 pt-8">
          <p className="text-[12px] text-white/30 text-center">
            &copy; {new Date().getFullYear()} Dispatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
