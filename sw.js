// 캐시 이름을 올릴 때마다(파일을 새로 배포할 때마다) 바꿔주면 예전 캐시가 자동 정리됩니다.
const CACHE_NAME = 'inspection-app-v4';
const ASSETS = [
  './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  // 오프라인에서도 엑셀/사진/PDF 기능이 동작하도록, 설치 시점에 강제로 미리 저장해두는
  // 외부 라이브러리들 (앱이 처음 인터넷에 연결된 상태로 한 번 열리면 이후엔 계속 사용 가능)
  'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // 외부 라이브러리 중 하나가 일시적으로 실패해도 설치 자체가 실패하지 않도록
      // 각각 개별적으로 시도합니다.
      Promise.all(ASSETS.map((url) =>
        cache.add(url).catch((err) => console.warn('사전 캐시 실패(무시하고 진행):', url, err))
      ))
    )
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
