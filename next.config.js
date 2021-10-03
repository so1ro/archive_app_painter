// with SW (Service Worker)
const withPWA = require('next-pwa')

// module.exports = withPWA({
//     images: {
//         domains: ['images.ctfassets.net', 'pbs.twimg.com', 'abs.twimg.com', 'i.ytimg.com'],
//     },
//     pwa: {
//         dest: 'public'
//     },
// })

// Develop without SW (Service Worker)
module.exports = {
    images: {
        domains: ['images.ctfassets.net', 'pbs.twimg.com', 'abs.twimg.com', 'i.ytimg.com'],
    },
}

// Twitter : 'pbs.twimg.com'
// Contentful : 'images.ctfassets.net'
// YouTube : 'i.ytimg.com'