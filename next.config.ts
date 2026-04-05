import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.0.38",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.38:3000",
  ],
};

export default nextConfig;
