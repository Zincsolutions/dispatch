import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Prompts", href: "#" }, { label: "Workflows", href: "#" },
      { label: "Images", href: "#" }, { label: "Ratings", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" }, { label: "Blog", href: "#" },
      { label: "Careers", href: "#" }, { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" }, { label: "Help Center", href: "#" },
      { label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img src="/dispatch-logo.svg" alt="Dispatch" className="h-9 w-auto brightness-0 invert opacity-90" />
            </Link>
            <p className="text-[13px] text-white/40 italic leading-relaxed mb-6">
              The system of record for AI.
            </p>
            <div className="flex gap-3">
              {[{ label: "X" }, { label: "in" }, { label: "GH" }].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <span className="text-xs text-white/40 font-medium">{social.label}</span>
                </a>
              ))}
            </div>
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
            &copy; 2026 Dispatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
