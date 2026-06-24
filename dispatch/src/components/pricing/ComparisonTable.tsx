"use client"

import { Fragment, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Minus, ChevronDown } from "lucide-react"
import { comparisonRows, type ComparisonRow } from "@/lib/pricing"

const COLUMNS: { key: keyof Omit<ComparisonRow, "group" | "feature">; label: string; badge?: string }[] = [
  { key: "personal", label: "Personal" },
  { key: "starter", label: "Starter" },
  { key: "team", label: "Team", badge: "Popular" },
  { key: "enterprise", label: "Enterprise" },
]

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="h-[18px] w-[18px] text-[#141414] mx-auto" strokeWidth={2.5} aria-label="Included" />
  }
  if (value === false) {
    return <Minus className="h-[18px] w-[18px] text-[#CFCFCC] mx-auto" strokeWidth={2.5} aria-label="Not included" />
  }
  return <span className="text-[14px] text-[#333]">{value}</span>
}

export function ComparisonTable() {
  const [open, setOpen] = useState(false)

  // Build grouped render order: a group-header row before each new group.
  const groups: { group: string; rows: ComparisonRow[] }[] = []
  for (const row of comparisonRows) {
    const last = groups[groups.length - 1]
    if (!last || last.group !== row.group) groups.push({ group: row.group, rows: [row] })
    else last.rows.push(row)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 rounded-2xl border border-[#E5E5E3] px-6 py-5 text-left hover:bg-[#FAFAF9] transition-colors"
        >
          <span className="text-lg sm:text-xl font-extrabold text-[#141414]">
            Compare all features
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-[#666] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="overflow-x-auto pt-6">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E5E3]">
                      <th className="text-left py-4 pr-4 text-[13px] font-semibold text-[#999] uppercase tracking-wide w-[32%]">
                        Feature
                      </th>
                      {COLUMNS.map((col) => (
                        <th
                          key={col.key}
                          className={`py-4 px-3 text-center text-[15px] font-extrabold text-[#141414] w-[17%] ${
                            col.key === "team" ? "bg-[#FDFF60]/[0.07] rounded-t-lg" : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {col.label}
                            {col.badge && (
                              <span className="bg-[#FDFF60] text-[#141414] text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                                {col.badge}
                              </span>
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <Fragment key={g.group}>
                        <tr>
                          <td
                            colSpan={5}
                            className="pt-7 pb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#999]"
                          >
                            {g.group}
                          </td>
                        </tr>
                        {g.rows.map((row) => (
                          <tr key={row.feature} className="border-b border-[#EDECEC]">
                            <td className="py-3.5 pr-4 text-[14px] font-medium text-[#141414]">
                              {row.feature}
                            </td>
                            {COLUMNS.map((col) => (
                              <td
                                key={col.key}
                                className={`py-3.5 px-3 text-center ${
                                  col.key === "team" ? "bg-[#FDFF60]/[0.05]" : ""
                                }`}
                              >
                                <Cell value={row[col.key]} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
