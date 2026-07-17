// ======================================
// Habit Tracker Service Worker
// ======================================

const CACHE_NAME = "habit-tracker-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

// ----------------------------
// Install
// ----------------------------

self.addEventListener("install", event => {

    console.log("Service Worker Installed");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))

    );

    self.skipWaiting();

});

// ----------------------------
// Activate
// ----------------------------

self.addEventListener("activate", event => {

    console.log("Service Worker Activated");

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        console.log("Removing old cache:", key);

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// ----------------------------
// Fetch
// ----------------------------

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        // Cache new GET requests
                        if (
                            event.request.method === "GET" &&
                            networkResponse.status === 200
                        ) {

                            const copy = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(event.request, copy);

                                });

                        }

                        return networkResponse;

                    })

                    .catch(() => {

                        // If offline and file isn't cached
                        if (event.request.mode === "navigate") {

                            return caches.match("./index.html");

                        }

                    });

            })

    );

});