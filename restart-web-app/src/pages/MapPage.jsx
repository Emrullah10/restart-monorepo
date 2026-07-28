import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import { useServices } from '@hooks/queries/useServices';
import styles from './MapPage.module.scss';

// Fix Leaflet marker default icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const initialCenter = [41.0082, 28.9784]; // Istanbul center

  const { data: services, isLoading } = useServices(filter === 'all' ? undefined : filter);
  const markers = services ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('navMap')} & Nokta Bulucu</h1>
          <p className={styles.subtitle}>En yakın tamir servisini, geri dönüşüm kutusunu veya satış mağazasını görün</p>
        </div>

        {/* Filter Controls */}
        <div className={styles.filterBar}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('repair')}
            className={`${styles.filterBtn} ${filter === 'repair' ? styles.activeFilter : ''}`}
          >
            Tamir
          </button>
          <button
            onClick={() => setFilter('recycle')}
            className={`${styles.filterBtn} ${filter === 'recycle' ? styles.activeFilter : ''}`}
          >
            Geri Dönüşüm
          </button>
          <button
            onClick={() => setFilter('sell')}
            className={`${styles.filterBtn} ${filter === 'sell' ? styles.activeFilter : ''}`}
          >
            Satış Noktaları
          </button>
        </div>
      </div>

      <GlassCard className={styles.mapCard} hoverEffect={false}>
        <div className={styles.mapWrapper}>
          {isLoading && <div className={styles.mapLoading}>Yükleniyor...</div>}
          <MapContainer center={initialCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((m) => (
              <Marker key={m.id} position={[m.latitude, m.longitude]}>
                <Popup>
                  <div className={styles.popupContent}>
                    <strong>{m.name}</strong>
                    <p>{m.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default MapPage;
