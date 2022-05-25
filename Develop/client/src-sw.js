// May not need offlineFallback 
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
// seems complete with pageCache assigned as the contents per https://developers.google.com/web/tools/workbox/guides/get-started 
registerRoute(
  ({ request }) => request.mode === 'navigate', 
  pageCache);
// Reference 19-20 sw.js 

// TODO: Implement asset caching
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
  // ({ request }) => 'script'.includes(request.destination),
  // new CacheFirst({
  //   cacheName: 'asset-cache',
  //   plugins: [
  //     new offlineFallback({
  //       statuses: [0, 200],
  //     }),
      // new ExpirationPlugin({
      //   maxEntries: 60,
      //   maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      // }),
    ],
  })
);
