// public/sw.js
// Service Worker para Push Notifications

const CACHE_NAME = 'agenda-salao-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests (cache offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Agendamento Salão', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || 'Agendamento Salão',
    body: data.message || data.body || 'Você tem uma nova notificação',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icon-dismiss.png'
      }
    ],
    tag: data.tag || 'agendamento-notification',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Click em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Abrir aplicação na página do agendamento
    const agendamentoId = event.notification.data.agendamentoId;
    const url = agendamentoId ? `/?agendamento=${agendamentoId}` : '/';
    
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (let client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Apenas fechar a notificação (já fechada acima)
    console.log('Notification dismissed');
  } else {
    // Click padrão na notificação
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Analytics ou logging se necessário
  if (event.notification.data && event.notification.data.notificationId) {
    // Enviar evento de fechamento para analytics
    console.log(`Notification ${event.notification.data.notificationId} was closed`);
  }
});

// Background sync (para notificações offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(
      // Processar notificações pendentes quando voltar online
      processOfflineNotifications()
    );
  }
});

async function processOfflineNotifications() {
  try {
    // Buscar notificações pendentes do IndexedDB ou cache
    const pendingNotifications = await getPendingNotifications();
    
    for (const notification of pendingNotifications) {
      try {
        await sendNotificationToServer(notification);
        await removePendingNotification(notification.id);
      } catch (error) {
        console.error('Erro ao processar notificação offline:', error);
      }
    }
  } catch (error) {
    console.error('Erro no background sync:', error);
  }
}

async function getPendingNotifications() {
  // Implementar busca em IndexedDB
  return [];
}

async function sendNotificationToServer(notification) {
  // Implementar envio para servidor
  return fetch('/api/notifications/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });
}

async function removePendingNotification(id) {
  // Implementar remoção do IndexedDB
  console.log(`Removing pending notification ${id}`);
}

// Mensagens do main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Responder para o main thread
  event.ports[0].postMessage({
    type: 'ACK',
    message: 'Service Worker ready'
  });
});