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
};
