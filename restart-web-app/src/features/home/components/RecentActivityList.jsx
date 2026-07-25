import React from 'react';
import { Recycle, Wrench, ShoppingCart, Award, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './RecentActivityList.module.scss';

export const RecentActivityList = ({ activities = [] }) => {
  const { t } = useTranslation();

  const mockActivities = [
    { id: 1, type: 'recycle', title: 'iPhone 11 Geri Dönüşüm', subtitle: '2 saat önce • +150 puan', amount: '+₺200', color: '#22C55E' },
    { id: 2, type: 'repair', title: 'MacBook Air Ekran Tamiri', subtitle: ' Dün • +300 puan', amount: '', color: '#3B82F6' },
    { id: 3, type: 'sell', title: 'iPad Pro Satış İlanı', subtitle: '3 gün önce • +50 puan', amount: '+₺4.500', color: '#F97316' }
  ];

  const list = activities.length > 0 ? activities : mockActivities;

  const getIcon = (type) => {
    switch (type) {
      case 'recycle': return Recycle;
      case 'repair': return Wrench;
      case 'sell': return ShoppingCart;
      case 'badge': return Award;
      default: return CheckCircle;
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('recentActivities')}</h3>
        <button className={styles.viewAllBtn}>{t('viewAll')}</button>
      </div>

      <div className={styles.list}>
        {list.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <GlassCard key={item.id} className={styles.card} hoverEffect={false}>
              <div className={styles.row}>
                <div
                  className={styles.iconCircle}
                  style={{ backgroundColor: `${item.color}1A`, color: item.color }}
                >
                  <Icon size={20} />
                </div>
                <div className={styles.info}>
                  <h4 className={styles.itemTitle}>{item.title}</h4>
                  <span className={styles.itemSub}>{item.subtitle}</span>
                </div>
                {item.amount && (
                  <span className={styles.amount}>{item.amount}</span>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityList;
