/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@starter/consent-agent-sdk",
    "@starter/appointment-booking-agent-sdk",
    "@starter/chat-agent-sdk",
    "@starter/tool-gateway",
    "@starter/observability"
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "node:async_hooks": false,
        async_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
