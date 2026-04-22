import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.96.43.107"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
