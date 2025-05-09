import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the App Router architecture
  reactStrictMode: true,
  // Custom output directory
  distDir: 'dist',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
