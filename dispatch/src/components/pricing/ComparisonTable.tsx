import { Check, Minus } from "lucide-react"
import { comparisonRows, type ComparisonRow } from "@/lib/pricing"

function Cell({ value }: { value: ComparisonRow["starter"] }) {
  if (value === true) {
    return <Check className="h-[18px] w-[18px] text-[#141414] mx-auto" strokeWidth={2.5} aria-label="Included" />
  }
  if (value === false) {
    return <Minus className="h-[18px] w-[18px] text-[#CFCFCC] mx-auto" strokeWidth={2.5} aria-label="Not included" />
  }
  return <span className="text-[14px] text-[#333]">{value}</span>
}

export function ComparisonTable() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] text-center leading-tight mb-3">
          Compare every plan.
        </h2>
        <p className="text-[15px] text-[#999] text-center mb-12">
          Generous seats on every plan. Scale up as your AI footprint grows.
        </p>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E3]">
                <th className="text-left py-4 pr-4 text-[13px] font-semibold text-[#999] uppercase tracking-wide w-[34%]">
                  Feature
                </th>
                <th className="py-4 px-3 text-center text-[15px] font-extrabold text-[#141414] w-[22%]">
                  Starter
                </th>
                <th className="py-4 px-3 text-center text-[15px] font-extrabold text-[#141414] w-[22%]">
                  <span className="inline-flex items-center gap-2">
                    Team
                    <span className="bg-[#FDFF60] text-[#141414] text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </span>
                </th>
                <th className="py-4 pl-3 text-center text-[15px] font-extrabold text-[#141414] w-[22%]">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-[#EDECEC] ${i % 2 === 1 ? "bg-[#FAFAF9]" : ""}`}
                >
                  <td className="py-3.5 pr-4 text-[14px] font-medium text-[#141414]">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Cell value={row.starter} />
                  </td>
                  <td className="py-3.5 px-3 text-center bg-[#FDFF60]/[0.05]">
                    <Cell value={row.team} />
                  </td>
                  <td className="py-3.5 pl-3 text-center">
                    <Cell value={row.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
