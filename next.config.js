/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.cloudflare.steamstatic.com' },
      { protocol: 'https', hostname: 'dlcdnwebimgs.asus.com' },
      { protocol: 'https', hostname: 'rog.asus.com' }
    ]
  }
};

module.exports = nextConfig;


