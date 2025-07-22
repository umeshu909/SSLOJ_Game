// next-sitemap.config.js
export default {
  siteUrl: 'https://ssloj.com',
  generateRobotsTxt: true,
  exclude: [
    '/translations',
    '/items',
    '/abilities',
    '/compare'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/translations',
          '/items',
          '/abilities',
          '/compare'
        ]
      }
    ],
    additionalSitemaps: [
      'https://ssloj.com/sitemap.xml',
    ],
  },
};
