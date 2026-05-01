import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["playwright", "playwright-core", "@sparticuz/chromium-min"],
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/playwright/**/*",
      "./node_modules/playwright-core/**/*",
      "./node_modules/@sparticuz/chromium-min/**/*",
    ],
  },
};

export default nextConfig;
