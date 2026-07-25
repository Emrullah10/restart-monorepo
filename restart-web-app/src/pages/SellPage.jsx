import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Plus, ShieldCheck, ShoppingBag, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import styles from './SellPage.module.scss';

export const SellPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'phone', label: 'Telefon' },
    { id: 'laptop', label: 'Laptop' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'accessory', label: 'Aksesuar' }
  ];

  const products = [
    { id: 1, title: 'iPhone 13 Pro 128GB Gümüş', category: 'phone', price: '₺28.500', status: 'Temiz / Kutulu', seller: 'Ahmet Y.', image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'MacBook Pro M1 16GB 512GB', category: 'laptop', price: '₺34.000', status: 'Garantisi Devam Ediyor', seller: 'Zeynep K.', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'iPad Air 5. Nesil 64GB Wi-Fi', category: 'tablet', price: '₺16.200', status: 'Sıfır Ayarında', seller: 'Mehmet B.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400' },
    { id: 4, title: 'AirPods Pro 2. Nesil Magsafe', category: 'accessory', price: '₺5.800', status: 'Faturalı', seller: 'Elif S.', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=400' }
  ];

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

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

      {/* Category Filter Chips */}
      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`${styles.chip} ${activeCategory === cat.id ? styles.activeChip : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>{t('marketplaceTitle')}</h2>
        <div className={styles.productsGrid}>
          {filtered.map((prod) => (
            <GlassCard key={prod.id} className={styles.productCard}>
              <div className={styles.imageBox}>
                <img src={prod.image} alt={prod.title} />
                <span className={styles.statusBadge}>{prod.status}</span>
              </div>
              <div className={styles.productDetails}>
                <h3 className={styles.prodTitle}>{prod.title}</h3>
                <span className={styles.sellerText}>Satıcı: {prod.seller}</span>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{prod.price}</span>
                  <button className={styles.detailBtn}>
                    <Eye size={16} /> İncele
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellPage;
