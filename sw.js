// Mode hors ligne : l'application et la base de contenus restent disponibles sans réseau (métro, train…).
const CACHE = "chevet-demo-v1";
const FILES = ["./", "index.html", "data/base.json", "manifest.webmanifest",
  "assets/logo.jpg", "assets/photo-revision.jpg", "assets/photo-quiz.jpg", "assets/photo-equipes.jpg",
  "assets/photo-duel.jpg", "assets/photo-tuteur.jpg", "assets/photo-validation.jpg", "assets/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // Réseau d'abord (contenus toujours à jour), cache si pas de connexion.
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
