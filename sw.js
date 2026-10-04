// Family Hub service worker: app shell offline, live data always from the network.
const CACHE='family-hub-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png',
 './img/selfie.jpg','./img/cutout.png','./img/koala.jpg','./img/collage.jpg','./img/bridge.jpg','./img/kurta.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin!==location.origin)return; // GitHub API, fonts, CDN: straight to network
  if(/school\.json|data\.json/.test(u.pathname)){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
  // network first for the page so updates arrive, cache fallback when offline
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
