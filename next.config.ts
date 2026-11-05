import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // the site lives inside the factory repo, which has its own lockfile: pin the root to this folder
  turbopack: { root: import.meta.dirname },
  // create-next-app defaults: the static shell + partial prefetching (references/rendering.md)
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // every `quality` prop used must be listed (Next 16 default: [75] only)
    qualities: [75],
  },
};

export default createNextIntlPlugin()(nextConfig);
