// src/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // <- points to src/frontend
  },
};

module.exports = nextConfig;
