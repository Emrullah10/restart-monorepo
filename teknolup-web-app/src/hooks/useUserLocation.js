import { useEffect, useState } from 'react';

/** Asks for the browser position once. `coords` stays null when denied/unavailable (distances are then hidden). */
export const useUserLocation = () => {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => setCoords(null),
      { maximumAge: 300000, timeout: 8000 },
    );
  }, []);
  return coords;
};
export default useUserLocation;
