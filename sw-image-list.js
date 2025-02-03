// Načítať zoznam obrázkov zo servera
self.addEventListener('install', (event) => {
    event.waitUntil(
      fetch('/image-list.json')  // Načítame zoznam obrázkov zo súboru
        .then(response => response.json())  // Preveďte odpoveď na JSON
        .then(imageUrls => {
          return caches.open('otazkyPng-cache').then((cache) => {
            // Pridáme všetky obrázky do cache
            return cache.addAll(imageUrls);
          });
        })
        .catch(err => console.log('Chyba pri načítavaní obrázkov:', err))
    );
  });
  