/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare const self: ServiceWorkerGlobalScope;

// registerType: "autoUpdate" côté client : le nouveau SW prend la main sans attendre
// la fermeture de tous les onglets
self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// SPA : toute navigation (y compris /deck/xyz en direct, hors ligne) sert index.html.
// Les URLs Firebase Auth (/__/auth/…) doivent atteindre le réseau.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), {
    denylist: [/^\/__\//],
  })
);

// Feuille de style Google Fonts : réseau d'abord si possible, sinon cache
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets" })
);

// Fichiers de police : immuables, cache d'abord pendant un an
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// Icônes PWA hors précache (dossiers windows11/ios/android) : cache d'abord
registerRoute(
  ({ request, url }) =>
    request.destination === "image" && url.pathname.startsWith("/icons/"),
  new CacheFirst({
    cacheName: "app-icons",
    plugins: [new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
);
