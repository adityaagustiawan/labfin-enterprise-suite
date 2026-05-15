import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod/v3': 'zod',
    };
    return config;
  },
};

export default nextConfig;
