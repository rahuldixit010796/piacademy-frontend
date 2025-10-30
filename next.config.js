/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,
  // Enable Turbopack only during development
  ...(isDev ? { turbopack: {} } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
    unoptimized: true, // ✅ disable next optimization for remote images

};

module.exports = nextConfig;
