import React from 'react';
import { Wrench, Shield, Clock, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import { SkeletonCard } from '@components/Skeleton/Skeleton';
import EmptyState from '@components/EmptyState/EmptyState';
import { useServices } from '@hooks/queries/useServices';
import styles from './RepairPage.module.scss';

export const RepairPage = () => {
  const { t } = useTranslation();

  const infoCards = [
    { title: 'Ekran & Cam Değişimi', time: '45 Dakikada Teslim', guarantee: '6 Ay Garanti' },
    { title: 'Batarya & Pil Yenileme', time: '30 Dakikada Teslim', guarantee: '1 Yıl Garanti' },
    { title: 'Sıvı Teması & Anakart Onarımı', time: '1 Günde Detaylı Test', guarantee: 'Orijinal Yedek Parça' }
  ];

  const { data: shops, isLoading } = useServices('repair');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('homeActionRepair')} Servisi</h1>
        <p className={styles.subtitle}>Cihazınızı çöpe atmayın, uzman ellerde garantili tamir ettirin</p>
      </div>

      <div className={styles.grid}>
        {infoCards.map((item, idx) => (
          <GlassCard key={idx} className={styles.card} hoverEffect={false}>
            <div className={styles.iconBadge}>
              <Wrench size={28} />
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Clock size={16} /> <span>{item.time}</span>
              </div>
              <div className={styles.infoItem}>
                <Shield size={16} /> <span>{item.guarantee}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className={styles.shopsSection}>
        <h2 className={styles.sectionTitle}>Yakındaki Tamir Servisleri</h2>
        {isLoading && (
          <div className={styles.shopList}>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        )}
        {!isLoading && (shops ?? []).length === 0 && (
          <EmptyState title="Yakınında tamir servisi bulunamadı" subtitle="Farklı bir bölge veya daha sonra tekrar deneyin." />
        )}
        <div className={styles.shopList}>
          {(shops ?? []).map((shop) => (
            <GlassCard key={shop.id} className={styles.shopCard} hoverEffect={false}>
              <div className={styles.shopInfo}>
                <h4 className={styles.shopName}>{shop.name}</h4>
                <div className={styles.shopMeta}>
                  {shop.address && (
                    <span className={styles.metaItem}><MapPin size={14} /> {shop.address}</span>
                  )}
                  {shop.rating != null && (
                    <span className={styles.metaItem}><Star size={14} /> {shop.rating}</span>
                  )}
                </div>
                {shop.tags && <span className={styles.shopTags}>{shop.tags}</span>}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepairPage;
