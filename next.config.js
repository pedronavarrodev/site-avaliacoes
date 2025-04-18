/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  images: {
    domains: ['cdn.fivemetstore.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.fivemetstore.com',
        port: '',
        pathname: '/etstore/**',
      },
    ],
  },
}

module.exports = nextConfig 