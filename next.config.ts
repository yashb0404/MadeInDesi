import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The desktop folder above this one carries an unrelated lockfile; pin the
  // workspace root so Turbopack does not walk up and find it.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
