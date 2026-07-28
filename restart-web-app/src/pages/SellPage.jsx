import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import ProductGrid from '@features/marketplace/components/ProductGrid';
import MarketplaceSearchBar from '@features/marketplace/components/MarketplaceSearchBar';
import { useAuthStore } from '@store/authStore';
import { useProducts, useUserListings } from '@hooks/queries/useMarketplace';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { resolveImageUrl } from '@shared/utils/resolveImageUrl';
import styles from './SellPage.module.scss';

export const SellPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 300);
  const userId = useAuthStore((state) => state.user?.id);

  const category = activeCategory === 'all' ? undefined : activeCategory;
  const { data: products, isLoading } = useProducts({ category, q: debouncedSearch || undefined });
  const { data: myListings } = useUserListings(userId);
  const filtered = products ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('navSell')} & İkinci El Pazarı</h1>
          <p className={styles.subtitle}>Kullanmadığın cihazları güvenle nakde çevir ya da yenilenmiş cihazlar satın al</p>
        </div>

        <GradientButton onClick={() => navigate('/create-listing')}>
          <Plus size={18} /> {t('createListingButton')}
        </GradientButton>
      </div>

      {/* Safe Selling Banner */}
      <GlassCard className={styles.bannerCard} hoverEffect={false}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerIcon}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className={styles.bannerTitle}>{t('safeSellingTitle')}</h3>
            <p className={styles.bannerSub}>{t('safeSellingSub')}</p>
          </div>
        </div>
      </GlassCard>

      {/* Search + Category Nav */}
      <MarketplaceSearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* My Listings */}
      {myListings && myListings.length > 0 && (
        <div className={styles.gridSection}>
          <h2 className={styles.sectionTitle}>{t('activeListings')}</h2>
          <div className={styles.productsGrid}>
            {myListings.map((listing) => (
              <GlassCard key={listing.id} className={styles.productCard}>
                <div className={styles.imageBox}>
                  <img
                    src={resolveImageUrl(listing.images?.[0] ?? listing.imageUrl) ?? '/placeholder-product.svg'}
                    alt={listing.title}
                  />
                  <span className={styles.statusBadge}>{listing.status}</span>
                </div>
                <div className={styles.productDetails}>
                  <h3 className={styles.prodTitle}>{listing.title}</h3>
                  {listing.description && <span className={styles.sellerText}>{listing.description}</span>}
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₺{listing.price}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>{t('marketplaceTitle')}</h2>
        <ProductGrid
          products={filtered}
          isLoading={isLoading}
          emptyTitle="Bu kategoride ürün bulunamadı"
          emptySubtitle="Farklı bir kategori seçmeyi deneyin."
        />
      </div>
    </div>
  );
};

export default SellPage;
