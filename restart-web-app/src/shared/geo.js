export const distanceKm = (a, b) => {
  if (!a || !b || b.latitude == null || b.longitude == null) return null;
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude), dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
export const directionsUrl = (s) => `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
