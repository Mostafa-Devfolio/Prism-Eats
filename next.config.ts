import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// بنعرف الـ Plugin مكان ملف الإعدادات بتاعنا
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
