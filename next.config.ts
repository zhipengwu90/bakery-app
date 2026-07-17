import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ulvercpsyyouzcskzqca.supabase.co",
        pathname: "**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 2678400, // 31 days — gallery/menu images are immutable once uploaded
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384, 600, 800],
    // TEMP: Vercel Image Optimization quota exceeded (402). Bypasses the
    // optimizer entirely — images load as-is instead of failing to load.
    // Remove once the Vercel plan/limit is sorted out.
    unoptimized: true,
  },
};

export default nextConfig;
