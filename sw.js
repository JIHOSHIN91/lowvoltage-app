// 캐시 이름을 올릴 때마다(파일을 새로 배포할 때마다) 바꿔주면 예전 캐시가 자동 정리됩니다.
const CACHE_NAME = 'inspection-app-v3';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선: 인터넷이 연결돼 있으면 항상 최신 파일을 받아오고,
// 오프라인일 때만 저장해둔 캐시를 사용합니다. (예전 버전이 계속 보이는 문제 방지)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
