/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.meetingmaker.tech', 'meetingmaker.tech'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;