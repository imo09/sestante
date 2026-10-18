/* sestante: copia per l'uso senza rete. Cambia VERSIONE a ogni pubblicazione. */
const VERSIONE = 'sestante-1.8.0';
const FILE = ["./", "./index.html", "./sestante-1.8.0.js", "./manifest.webmanifest", "./favicon.svg", "./icona-192.png", "./icona-512.png", "./icona-180.png", "./fonts/space-grotesk-latin-400-normal.woff2", "./fonts/space-grotesk-latin-500-normal.woff2", "./fonts/space-grotesk-latin-600-normal.woff2", "./fonts/space-grotesk-latin-700-normal.woff2", "./fonts/space-mono-latin-400-normal.woff2", "./fonts/space-mono-latin-700-normal.woff2", "./fonts/poppins-latin-600-normal.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(salvata => {
    const rete = fetch(r).then(risposta => {
      if (risposta && risposta.ok) { const copia = risposta.clone(); caches.open(VERSIONE).then(c => c.put(r, copia)); }
      return risposta;
    }).catch(() => salvata);
    return salvata || rete;
  }));
});
