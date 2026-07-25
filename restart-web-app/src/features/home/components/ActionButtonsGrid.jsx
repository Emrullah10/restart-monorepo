import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Tag, Recycle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@components/GlassCard/GlassCard';
import styles from './ActionButtonsGrid.module.scss';

export const ActionButtonsGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      id: 'repair',
      title: t('homeActionRepair'),
      subtitle: t('homeActionRepairSub'),
      icon: Wrench,
      color: '#3B82F6',
      route: '/repair'
    },
    {
      id: 'sell',
      title: t('homeActionSell'),
      subtitle: t('homeActionSellSub'),
      icon: Tag,
      color: '#F59E0B',
      route: '/sell'
    },
    {
      id: 'recycle',
      title: t('homeActionRecycle'),
      subtitle: t('homeActionRecycleSub'),
      icon: Recycle,
      color: '#22C55E',
      route: '/recycle'
    }
  ];

  return (
    <div className={styles.grid}>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <GlassCard
            key={act.id}
            onClick={() => navigate(act.route)}
            className={styles.card}
          >
            <div
              className={styles.iconBadge}
              style={{ backgroundColor: `${act.color}1A`, color: act.color }}
            >
              <Icon size={26} />
            </div>
            <h3 className={styles.cardTitle}>{act.title}</h3>
            <p className={styles.cardSubtitle}>{act.subtitle}</p>
          </GlassCard>
        );
      })}
    </div>
  );
};

export default ActionButtonsGrid;
