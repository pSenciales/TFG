import withNextIntl from 'next-intl/plugin';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl('./src/i18n/request.ts')(nextConfig);