"use strict";var precacheConfig=[["/index.html","37a69cfb0563f795b5c2e467c1993e55"],["/static/css/main.ecb3cb08.css","ecb3cb08551a6b72d0da3a3f53b6587a"],["/static/js/0.643e5d25.chunk.js","45248db60ecb6dd32e1b7781e9879616"],["/static/js/1.5080ad5e.chunk.js","319df34ace234c3a3a5753f7e3577d0d"],["/static/js/2.62dd14ba.chunk.js","9013c305a849bce7f56dd317c7bd76dc"],["/static/js/3.0da10241.chunk.js","7b9df2b447e3ada0b127812e5bcdf76a"],["/static/js/4.24ada47f.chunk.js","d61be1ea2383d261e94acdc0db7ede82"],["/static/js/5.89d4cfb2.chunk.js","2832bce48881bfdcf93ffd949d213763"],["/static/js/6.86a39c39.chunk.js","c9b6ac8dfa477fcdc4d013fa14985f37"],["/static/js/7.548251fe.chunk.js","1ef3d6d57c1606f58e882d936c43ecf3"],["/static/js/8.18755373.chunk.js","0c8d64940de38b73f0437be300d2aebf"],["/static/js/9.02edc476.chunk.js","5cb3d0f03f2c5456883823651e765529"],["/static/js/main.1f87384c.js","59fb2d5aea3925800f5e393e3a8f8b07"],["/static/js/manifest.f326398e.js","5287c2611626a428c9e47c96f303ecd2"],["/static/js/vendor.815f2aef.js","8a547b23dc972d0e8d2a1283b0619057"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var r=new URL(e);return a&&r.pathname.match(a)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),r=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var r="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});