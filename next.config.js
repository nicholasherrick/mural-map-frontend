const path = require('path');
const withPWA = require('next-pwa');

module.exports = withPWA({
    pwa: {
        dest: 'public'
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
});
