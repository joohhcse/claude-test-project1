import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.API_BACKEND_URL ??
  "http://ec2-54-180-140-46.ap-northeast-2.compute.amazonaws.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
