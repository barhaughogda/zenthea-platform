/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@zenthea/persistence-adapter",
    "@starter/ui", 
    "@starter/patient-scope-gate", 
    "@starter/observability",
    "@starter/patient-portal-agent",
    "@starter/ai-runtime"
  ],
};

export default nextConfig;
