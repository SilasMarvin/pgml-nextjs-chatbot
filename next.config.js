/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: path.resolve(
            __dirname,
            "pgml-nextjs-node-loader/dist/cjs.js",
          ),
        },
      ],
    });
    return config
  },
};

module.exports = nextConfig;
