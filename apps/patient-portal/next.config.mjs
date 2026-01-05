/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@starter/consent-agent-sdk",
    "@starter/appointment-booking-agent-sdk",
    "@starter/chat-agent-sdk"
  ],
};

export default nextConfig;
