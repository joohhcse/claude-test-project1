import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.API_BACKEND_URL || process.env.BACKEND_URL;

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
