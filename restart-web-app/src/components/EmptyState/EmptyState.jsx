import React from 'react';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.scss';

export const EmptyState = ({ icon: Icon = Inbox, title, subtitle }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconCircle}>
        <Icon size={28} />
      </div>
      <p className={styles.title}>{title}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
