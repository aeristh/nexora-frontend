import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api-uploads/:path*',
        destination: 'http://localhost:3333/uploads/:path*',
      },
    ]
  },
}

export default nextConfig