import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The "Context" section was renamed to "AI Foundation" (/context -> /foundation).
      // Keep old links and bookmarks working.
      { source: "/context", destination: "/foundation", permanent: false },
      { source: "/context/:path*", destination: "/foundation/:path*", permanent: false },
    ]
  },
};

export default nextConfig;
