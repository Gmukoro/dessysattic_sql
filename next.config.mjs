const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;

    // Prevent `fs`, `net`, `tls`, `http`, `https` from being resolved on the client side
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
      };
    }

    return config;
  },
};

export default nextConfig;
