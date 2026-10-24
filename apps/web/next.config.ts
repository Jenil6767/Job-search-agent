import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ai-jobpilot/types', '@ai-jobpilot/config'],
};

export default nextConfig;
