/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: "nextjs-node-loader" 
        },
      ],
    });
    return config
  },
};

module.exports = nextConfig;
