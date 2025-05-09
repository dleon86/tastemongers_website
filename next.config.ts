import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standard page extensions but we'll rely on the App Router
  swcMinify: true,
  reactStrictMode: true,
  // Routes will come from the app directory
  distDir: 'dist'
};

export default nextConfig;
