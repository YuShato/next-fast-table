/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // sluzhilye.ru is served through a reverse proxy in Russia that forwards
      // to yushato-fast-table.netlify.app, so the browser Origin differs from Host
      allowedOrigins: ['sluzhilye.ru', 'www.sluzhilye.ru'],
    },
  },
};

module.exports = nextConfig;
