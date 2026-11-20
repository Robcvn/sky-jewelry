import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  // Inlined into every bundle at build time: the Top Bar's mock sale ends a few days after the build.
  env: {
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
};

export default nextConfig;
