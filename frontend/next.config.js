/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Tree-shaking & compile-time optimisations ──────────────────────────
  // Tells Next.js to barrel-import optimally from these packages
  // so only the icons actually used get compiled — eliminates the
  // 55-second first-compile problem caused by loading all react-icons.
  experimental: {
    optimizePackageImports: [
      "react-icons/ri",
      "react-icons/tb",
      "react-icons/pi",
      "react-icons/hi2",
      "react-icons/md",
      "react-icons/fa",
      "react-icons/bs",
      "react-icons/io5",
      "react-icons/fi",
      "gsap",
    ],
  },

  // Faster JS minification (uses SWC instead of Terser)
  swcMinify: true,
};

module.exports = nextConfig;
