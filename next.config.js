/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    // (Optional) Export as a static site
    // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
    output: 'export', // Feel free to modify/remove this option

    // Override the default webpack configuration
    webpack: (config, { isServer }) => {
        // Ignore node-specific modules when bundling for the browser
        // See https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
            '@huggingface/transformers': path.resolve(__dirname, 'node_modules/@huggingface/transformers'),
        }
        return config;
    },
};

module.exports = nextConfig;
