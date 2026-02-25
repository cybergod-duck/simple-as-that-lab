/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/website-creation-for-:industry',
        destination: '/industry-landing/:industry',
      },
    ]
  },
};

export default nextConfig;
