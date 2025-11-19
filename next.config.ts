import type { NextConfig } from "next";

// Optional reverse proxy to avoid CORS and mixed-content issues.
// Set PUBQUIZ_API_PROXY_TARGET to your backend base URL (e.g. http://127.0.0.1:6767 or https://api.example.com)
// and set NEXT_PUBLIC_API_BASE_URL to "/api". Requests from the browser will then go to the same origin
// and be proxied to the backend by Next.js.
const PROXY_TARGET = process.env.PUBQUIZ_API_PROXY_TARGET?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!PROXY_TARGET) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default nextConfig;
