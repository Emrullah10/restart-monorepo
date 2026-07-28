import React from 'react';
import GlassCard from '@components/GlassCard/GlassCard';
import { Skeleton } from '@components/Skeleton/Skeleton';
import { resolveImageUrl } from '@shared/utils/resolveImageUrl';
import styles from './FeaturedCarousel.module.scss';

export const FeaturedCarousel = ({ title = 'Öne Çıkan İlanlar', products, isLoading }) => {
  const list = products ?? [];

  if (!isLoading && list.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.track}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton height="140px" radius="12px" />
              <Skeleton height="12px" width="70%" />
              <Skeleton height="12px" width="40%" />
            </div>
          ))}

        {!isLoading &&
          list.map((prod) => (
            <GlassCard key={prod.id} className={styles.card}>
              <div className={styles.imageBox}>
                <img
                  src={resolveImageUrl(prod.images?.[0] ?? prod.imageUrl) ?? '/placeholder-product.svg'}
                  alt={prod.title}
                />
              </div>
              <h4 className={styles.cardTitle}>{prod.title}</h4>
              <span className={styles.cardPrice}>₺{prod.price}</span>
            </GlassCard>
          ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
