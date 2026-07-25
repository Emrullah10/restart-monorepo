import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Recycle, Store, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './NearbyServicesList.module.scss';

export const NearbyServicesList = ({ services = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mockServices = [
    { id: '1', name: 'Kadıköy E-Tamir & Yenileme Merkezi', address: '1.2 km • Moda Cad. No:45', rating: 4.9, tags: 'Ekran, Batarya, Anakart', type: 'repair', color: '#3B82F6' },
    { id: '2', name: 'Beşiktaş Belediyesi E-Atık Toplama', address: '2.5 km • Ihlamurdere Cad.', rating: 4.8, tags: 'Sıfır Atık Sertifikalı', type: 'recycle', color: '#22C55E' },
    { id: '3', name: 'ReStart Onaylı İkinci El Mağazası', address: '3.1 km • Bağdat Cad. No:112', rating: 4.7, tags: 'Anında Ekspertiz & Ödeme', type: 'sell', color: '#F97316' }
  ];

  const list = services.length > 0 ? services : mockServices;

  const getIcon = (type) => {
    switch (type) {
      case 'repair': return Wrench;
      case 'recycle': return Recycle;
      case 'sell': return Store;
      default: return MapPin;
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('nearbyServicesTitle')}</h3>
        <button onClick={() => navigate('/map')} className={styles.mapBtn}>
          {t('viewOnMapButton')}
        </button>
      </div>

      <div className={styles.list}>
        {list.map((srv) => {
          const Icon = getIcon(srv.type);
          return (
            <GlassCard key={srv.id} className={styles.card} hoverEffect={false}>
              <div className={styles.row}>
                <div
                  className={styles.iconBox}
                  style={{ backgroundColor: `${srv.color}1A`, color: srv.color }}
                >
                  <Icon size={24} />
                </div>

                <div className={styles.info}>
                  <h4 className={styles.serviceName}>{srv.name}</h4>
                  <div className={styles.addressRow}>
                    <span className={styles.addressText}>{srv.address}</span>
                    <div className={styles.ratingBox}>
                      <Star size={14} className={styles.starIcon} />
                      <span className={styles.ratingText}>{srv.rating}</span>
                    </div>
                  </div>
                  <span className={styles.tags}>{srv.tags}</span>
                </div>

                <button className={styles.actionBtn}>
                  {srv.type === 'repair' ? t('actionContact') : t('actionGetDirections')}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyServicesList;
