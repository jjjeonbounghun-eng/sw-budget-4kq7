var CACHE='swiss-budget-v3';
var CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET') return;
  var url=new URL(req.url);
  var ok=url.origin===location.origin||url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'||url.hostname==='cdn.jsdelivr.net';
  if(!ok) return;
  e.respondWith(caches.open(CACHE).then(function(cache){
    var key=req.mode==='navigate'?'index.html':req;
    return cache.match(key).then(function(hit){
      var net=fetch(req).then(function(res){
        if(res&&(res.ok||res.type==='opaque')) cache.put(key,res.clone());
        return res;
      }).catch(function(){return hit;});
      return hit||net;
    });
  }));
});
