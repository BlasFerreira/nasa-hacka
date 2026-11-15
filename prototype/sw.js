/* Service worker de la app (PWA).
   - La página se pide primero a la red (así siempre llega la última versión) y, sin conexión, sale del caché.
   - Leaflet, íconos y fuentes se guardan al instalar o la primera vez que se usan.
   - Los mosaicos del mapa se guardan al verlos, con un tope, para poder revisar el campo sin señal.
   - Las consultas a la API de NASA POWER van siempre a la red. */
const VERSION = 'v3';
const SHELL = 'fs-shell-' + VERSION;
const RUNTIME = 'fs-runtime-' + VERSION;
const TILES = 'fs-tiles-' + VERSION;
const MAX_TILES = 400;

const LEAFLET = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
];
const PRECACHE = ['/app', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'];
const HOSTS_TILES = ['server.arcgisonline.com', 'tile.openstreetmap.org'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all([
      ...PRECACHE.map(u => cache.add(u).catch(() => {})),
      ...LEAFLET.map(u => cache.add(new Request(u, { mode: 'cors' })).catch(() => {})),
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const vigentes = [SHELL, RUNTIME, TILES];
    for (const k of await caches.keys()) if (k.startsWith('fs-') && !vigentes.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function recortar(cache, max) {
  const claves = await cache.keys();
  for (let i = 0; i < claves.length - max; i++) await cache.delete(claves[i]);
}

// Red primero; si falla, caché. Para las páginas.
async function redPrimero(request) {
  try {
    const resp = await fetch(request);
    if (resp && resp.ok) { const c = await caches.open(SHELL); c.put(request, resp.clone()); }
    return resp;
  } catch (e) {
    const c = await caches.open(SHELL);
    return (await c.match(request, { ignoreSearch: true })) || (await c.match('/app')) || Response.error();
  }
}
// Devuelve lo guardado al instante y actualiza en segundo plano.
async function conRevalidacion(request, nombre) {
  const c = await caches.open(nombre);
  const guardado = await c.match(request);
  const red = fetch(request).then(resp => { if (resp && (resp.ok || resp.type === 'opaque')) c.put(request, resp.clone()); return resp; }).catch(() => null);
  return guardado || (await red) || Response.error();
}
// Caché primero (mosaicos de mapa): rápido y sirve sin conexión.
// Un pedido con CORS (texturas de Climate Twin) no puede usar una respuesta opaca guardada por Leaflet: en ese caso se
// pide a la red y se guarda la versión con CORS, que también le sirve a Leaflet.
async function cachePrimero(request) {
  const c = await caches.open(TILES);
  const guardado = await c.match(request);
  if (guardado && !(request.mode === 'cors' && guardado.type === 'opaque')) return guardado;
  try {
    const resp = await fetch(request);
    if (resp && (resp.ok || resp.type === 'opaque')) { c.put(request, resp.clone()); recortar(c, MAX_TILES); }
    return resp;
  } catch (e) { return Response.error(); }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'power.larc.nasa.gov') return;              // datos en vivo: siempre a la red
  if (req.mode === 'navigate') { event.respondWith(redPrimero(req)); return; }
  if (HOSTS_TILES.some(h => url.hostname.endsWith(h))) { event.respondWith(cachePrimero(req)); return; }
  if (url.origin === location.origin || url.hostname === 'cdnjs.cloudflare.com' ||
      url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(conRevalidacion(req, url.origin === location.origin ? SHELL : RUNTIME));
  }
});
