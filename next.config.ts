import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "proclip-website";

const nextConfig: NextConfig = {
  // Static export only when building for GitHub Pages marketing/demo shell
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {
        images: {
          remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "cdn.jsdelivr.net" },
          ],
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
                {
                  key: "Content-Security-Policy",
                  value:
                    "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net blob:; worker-src 'self' blob:; connect-src 'self' https: blob: data:; media-src 'self' blob: data: https:; img-src 'self' data: blob: https:;",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
