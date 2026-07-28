import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import ProductGrid from '@features/marketplace/components/ProductGrid';
import MarketplaceSearchBar from '@features/marketplace/components/MarketplaceSearchBar';
import MarketplaceHero from '@features/marketplace/components/MarketplaceHero';
import CategoryStrip from '@features/marketplace/components/CategoryStrip';
import FeaturedCarousel from '@features/marketplace/components/FeaturedCarousel';
import { useProducts } from '@hooks/queries/useMarketplace';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import styles from './PublicMarketplacePage.module.scss';

export const PublicMarketplacePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  const category = activeCategory === 'all' ? undefined : activeCategory;
  const { data: featured, isLoading: featuredLoading } = useProducts({ limit: 8 });
  const { data: products, isLoading } = useProducts({ category, q: debouncedSearch || undefined });

  return (
    <div className={styles.container}>
      <MarketplaceSearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <MarketplaceHero
        title="E-atığını değere dönüştür"
        subtitle="Kullanmadığın telefon, laptop ve tabletleri ReStart pazarında saniyeler içinde satışa çıkar. Ücretsiz hesap oluşturman yeterli."
        ctaLabel="Hemen İlan Ver"
        onCtaClick={() => navigate('/register')}
      />

      <CategoryStrip activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <FeaturedCarousel products={featured} isLoading={featuredLoading} />

      <GlassCard className={styles.bannerCard} hoverEffect={false}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerIcon}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className={styles.bannerTitle}>Güvenli İkinci El Satış</h3>
            <p className={styles.bannerSub}>ReStart güvencesiyle kullanmadığın cihazları kolayca sat.</p>
          </div>
        </div>
      </GlassCard>

      <div className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>Tüm İlanlar</h2>
        <ProductGrid
          products={products}
          isLoading={isLoading}
          emptyTitle="Henüz ilan yok"
          emptySubtitle="Bu kategoride ilk ilanı sen ver — ücretsiz hesap oluşturman yeterli."
        />
      </div>

      <GlassCard className={styles.ctaCard} hoverEffect={false}>
        <div>
          <h3 className={styles.ctaTitle}>İlan vermek veya ilanlarını yönetmek ister misin?</h3>
          <p className={styles.ctaSub}>Ücretsiz hesap oluştur, cihazlarını saniyeler içinde satışa çıkar.</p>
        </div>
        <div className={styles.ctaActions}>
          <button className={styles.loginLink} onClick={() => navigate('/login')}>Giriş Yap</button>
          <GradientButton onClick={() => navigate('/register')}>Kayıt Ol</GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default PublicMarketplacePage;
