import { ImageResponse } from "next/og"

export const alt = "Dispatch — Turn AI chaos into a system your team can run on"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#141414",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              backgroundColor: "#FDFF60",
            }}
          />
          <div
            style={{
              fontSize: 36,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            Dispatch
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            lineHeight: 1.1,
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex" }}>Turn AI chaos into</div>
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ color: "#FDFF60" }}>a system</span>
            <span>your team</span>
          </div>
          <div style={{ display: "flex" }}>can run on.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div>The system of record for AI.</div>
          <div>dispatchvault.com</div>
        </div>
      </div>
    ),
    size
  )
}
