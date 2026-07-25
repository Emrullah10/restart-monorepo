import React from 'react';
import { Wrench, Shield, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import GradientButton from '@components/GradientButton/GradientButton';
import styles from './RepairPage.module.scss';

export const RepairPage = () => {
  const { t } = useTranslation();

  const services = [
    { title: 'Ekran & Cam Değişimi', time: '45 Dakikada Teslim', guarantee: '6 Ay Garanti', price: '₺850\'den başlayan' },
    { title: 'Batarya & Pil Yenileme', time: '30 Dakikada Teslim', guarantee: '1 Yıl Garanti', price: '₺650\'den başlayan' },
    { title: 'Sıvı Teması & Anakart Onarımı', time: '1 Günde Detaylı Test', guarantee: 'Orijinal Yedek Parça', price: '₺1.200\'den başlayan' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('homeActionRepair')} Servisi</h1>
        <p className={styles.subtitle}>Cihazınızı çöpe atmayın, uzman ellerde garantili tamir ettirin</p>
      </div>

      <div className={styles.grid}>
        {services.map((item, idx) => (
          <GlassCard key={idx} className={styles.card}>
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
            <div className={styles.priceRow}>
              <span className={styles.price}>{item.price}</span>
              <GradientButton>Randevu Al</GradientButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default RepairPage;
