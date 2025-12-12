// Service Worker básico apenas para permitir instalação PWA
// Sem funcionalidade offline

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado')
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado')
    event.waitUntil(clients.claim())
})

// Não faz cache - sempre busca da rede
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request))
})
