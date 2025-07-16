// function initializeMap(lat, lng, title, location) {
//     const map = L.map("map").setView([lat, lng], 12);
  
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 19,
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);
  
//     const airbnbIcon = L.icon({
//       iconUrl: "/images/pin.png", // make sure this image exists
//       iconSize: [40, 40],
//       iconAnchor: [20, 40],
//       popupAnchor: [0, -35],
//     });
  
//     L.marker([lat, lng], { icon: airbnbIcon })
//       .addTo(map)
//       .bindPopup(`<b>${title}</b><br>${location}`)
//       .openPopup();
//   }
  