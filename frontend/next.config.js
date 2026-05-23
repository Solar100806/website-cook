const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,

    // Tránh Turbopack chọn nhầm root (vd. thư mục user khi có nhiều lockfile) — có thể gây 404 / route lạ.
    turbopack: {
        root: path.join(__dirname),
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
