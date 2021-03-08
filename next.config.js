const path = require('path');

module.exports = {
    publicRuntimeConfig: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
};
