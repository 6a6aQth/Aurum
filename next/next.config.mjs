/** @type {import('next').NextConfig} */
const apiHost = process.env.IMAGE_HOSTNAME || 'localhost';
const mediaHost = process.env.IMAGE_MEDIA_HOSTNAME
  || (apiHost.endsWith('.strapiapp.com')
      ? apiHost.replace('.strapiapp.com', '.media.strapiapp.com')
      : apiHost);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: apiHost,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: mediaHost,
        pathname: '/**',
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
  async redirects() {
    let redirections = [];
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/redirections`
      );
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      return [];
    }
  },
};

export default nextConfig;
