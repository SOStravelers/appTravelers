self.addEventListener("push", function (event) {
  console.log("Push message received", event.data.json());
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "images/icon.png",
    badge: "images/badge.png",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://www.example.com"));
});
