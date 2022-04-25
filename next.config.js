/* eslint-disable @typescript-eslint/no-unused-vars, no-param-reassign */
/** @type {import('next').NextConfig} */
module.exports = {
  i18m: {
    defaultLocale: 'de-DE',
  },
  reactStrictMode: true,
  // für Docker
  experimental: {
    outputStandalone: true,
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};
