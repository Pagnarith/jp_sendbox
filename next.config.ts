import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  env: {
    NEXT_PUBLIC_APP_BRAND: "Sreypich Chan",
    NEXT_PUBLIC_APP_NAME: "JP Sendbox",
    NEXT_PUBLIC_BASE_PATH: "",
    DATAVERSE_PREFIX: "cr1f8",
    SENDBOX_MOCK_AUTH: "1",
  },
};

export default nextConfig;