/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hoirqrkdgbmvpwutwuwj.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'omf77i7evqckneoq.public.blob.vercel-storage.com',
      },
    ],
  },

  compiler: {
    // Odstranění console.log v produkci pro menší bundle
    removeConsole: process.env.NODE_ENV === 'production',
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
