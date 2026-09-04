// Service Worker for Marwat Gas Admin Push Notifications
// Handles push notifications when the admin panel is not the active tab

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Marwat Gas", body: event.data ? event.data.text() : "New notification" };
  }

  const title = data.title || "New Order Received";
  const options = {
    body: data.body || "A new order has been placed",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: data.tag || "marwat-order",
    data: data.data || { url: "/admin" },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
