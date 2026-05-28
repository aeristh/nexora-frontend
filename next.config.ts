import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/uploads/:path*`,
      },
    ]
  },
}

export default nextConfig