/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output for Azure App Service deployment
  // This creates a self-contained build that doesn't need node_modules
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Exclude powerbi-client from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('powerbi-client');
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
