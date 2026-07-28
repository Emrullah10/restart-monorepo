import React from 'react';
import { Eye } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import { Skeleton } from '@components/Skeleton/Skeleton';
import EmptyState from '@components/EmptyState/EmptyState';
import { resolveImageUrl } from '@shared/utils/resolveImageUrl';
import styles from './ProductGrid.module.scss';

export const ProductGrid = ({ products, isLoading, emptyTitle = 'Ürün bulunamadı', emptySubtitle }) => {
  const list = products ?? [];

  if (isLoading) {
    return (
      <div className={styles.productsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.productSkeleton}>
            <Skeleton height="180px" radius="12px" />
            <Skeleton height="14px" width="80%" />
            <Skeleton height="14px" width="40%" />
          </div>
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <div className={styles.productsGrid}>
      {list.map((prod) => (
        <GlassCard key={prod.id} className={styles.productCard}>
          <div className={styles.imageBox}>
            <img
              src={resolveImageUrl(prod.images?.[0] ?? prod.imageUrl) ?? '/placeholder-product.svg'}
              alt={prod.title}
            />
            {prod.location && <span className={styles.statusBadge}>{prod.location}</span>}
          </div>
          <div className={styles.productDetails}>
            <h3 className={styles.prodTitle}>{prod.title}</h3>
            {prod.description && <span className={styles.sellerText}>{prod.description}</span>}
            <div className={styles.priceRow}>
              <span className={styles.price}>₺{prod.price}</span>
              {prod.rating != null && (
                <span className={styles.ratingText}>
                  <Eye size={14} /> {prod.rating}
                </span>
              )}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default ProductGrid;
