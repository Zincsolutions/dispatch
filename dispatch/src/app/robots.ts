import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/prompts",
          "/workflows",
          "/agents",
          "/context",
          "/settings",
          "/invite/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://www.dispatchvault.com/sitemap.xml",
  }
}
