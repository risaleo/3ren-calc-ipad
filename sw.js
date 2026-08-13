const CACHE='nojima-3calc-v2.8.0';
const ASSETS=['./manifest.webmanifest?v=2.8.0','./icon-192.png?v=2.8.0','./icon-512.png?v=2.8.0','./apple-touch-icon.png?v=2.8.0','./mascot.png?v=2.8.0'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys()){if(k!==CACHE)await caches.delete(k)}await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate' || new URL(req.url).pathname.endsWith('/index.html') || new URL(req.url).pathname.endsWith('/')){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>r).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});return r;}).catch(()=>caches.match(req)));
});
