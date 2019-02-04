importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/0578365e64c9d42c853c.js",
    "revision": "5c74cae0ba93b8415b0d4fa1c1f339ab"
  },
  {
    "url": "/_nuxt/1124f08ee55cfc6da0e3.js",
    "revision": "fa66ffc518701b9a2d539cd743c4b863"
  },
  {
    "url": "/_nuxt/1d8aed127b0a5f98d2ec.js",
    "revision": "1c277825f796b2f016411414b583b1b7"
  },
  {
    "url": "/_nuxt/20b007dd127a7d73e734.js",
    "revision": "a860f2dc4b44515540c1a3cc39efcc04"
  },
  {
    "url": "/_nuxt/28698151db38c62e0ca5.js",
    "revision": "736cdd3765456c318cef45060a532caf"
  },
  {
    "url": "/_nuxt/3adceb2d88eee2915bdd.js",
    "revision": "bcf26c9cf31eba21b054a9cb3c5f1cac"
  },
  {
    "url": "/_nuxt/42ab8dc171b9f493489e.js",
    "revision": "0d42e7ae1dbaed1132e7e9f131c0990c"
  },
  {
    "url": "/_nuxt/42f2c64e51c7ff0d0dcf.js",
    "revision": "2f0af2e3cc8d0b6b57c0d6dc650eab10"
  },
  {
    "url": "/_nuxt/4d5388383f37c477ca99.js",
    "revision": "c46bb329015175435bd2dbd7b178e14c"
  },
  {
    "url": "/_nuxt/6c7064225ba5f05a8cdd.js",
    "revision": "406aa2c8501a617e5876d27365aa6451"
  },
  {
    "url": "/_nuxt/7ca12839170ee6dc100b.js",
    "revision": "201b6f9cfd7fe98b512424cc7961c1df"
  },
  {
    "url": "/_nuxt/a49775f156d95525d01e.js",
    "revision": "f87c09ea23ba1f05f00b23d83518a882"
  },
  {
    "url": "/_nuxt/c50cfca93fbb3c24747a.js",
    "revision": "11271374a5c2635f8da3f9247fb43957"
  },
  {
    "url": "/_nuxt/d1dd9a402c0796e3dd1f.js",
    "revision": "55ef05e1ff7f48813e234dd2bd3572eb"
  },
  {
    "url": "/_nuxt/e60353ba76d6be8b3b69.js",
    "revision": "cf713776f99ba78672bd97dede84c344"
  },
  {
    "url": "/_nuxt/f9b6d2efa06a2dc16149.js",
    "revision": "dd65104d077f8c8658d859cb491cbb8d"
  },
  {
    "url": "/_nuxt/ons.40ac840e.js",
    "revision": "bdfc64563fadaafd6b988984058fefd9"
  }
], {
  "cacheId": "kowalla-app",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
