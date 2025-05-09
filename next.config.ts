import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the App Router architecture
  reactStrictMode: true,
  // Custom output directory
  distDir: 'dist'
};

export default nextConfig;
