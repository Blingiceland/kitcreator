/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the headless-Chrome packages out of the bundle; they are required at
  // runtime in the /api/render Node function.
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
    // Vercel's file tracing misses the Chromium binary (bin/*.br); force it into
    // the /api/render function or the launch fails with "bin does not exist".
    outputFileTracingIncludes: {
      "/api/render": ["./node_modules/@sparticuz/chromium/bin/**"],
    },
  },
};

export default nextConfig;
